import config from '../config/env.js';
import {
  buildUserDesignImageKey,
  deleteObject,
  generateSignedViewUrl,
  isUserDesignObjectKey,
  listUserDesignObjects,
  uploadObject
} from '../services/storageService.js';

const ONE_HOUR_SECONDS = 3600;

const ensureUserOwnsKey = ({ userId, key }) => {
  const isAllowed = isUserDesignObjectKey({ userId, key });

  if (!isAllowed) {
    const error = new Error('You can only access your own design files');
    error.statusCode = 403;
    throw error;
  }
};

export const uploadDesignImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required. Use multipart/form-data with field name "file".'
      });
    }

    const userId = String(req.user.userId);
    const key = buildUserDesignImageKey({
      userId,
      originalName: req.file.originalname
    });

    await uploadObject({
      key,
      body: req.file.buffer,
      contentType: req.file.mimetype
    });

    const signedUrlData = await generateSignedViewUrl({
      key,
      expiresIn: config.s3SignedUrlExpires || ONE_HOUR_SECONDS
    });

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        key,
        bucket: config.s3Bucket,
        contentType: req.file.mimetype,
        size: req.file.size,
        signedUrl: signedUrlData.url,
        expiresIn: signedUrlData.expiresIn
      }
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllDesignImages = async (req, res, next) => {
  try {
    const userId = String(req.user.userId);
    const objects = await listUserDesignObjects({ userId });

    const images = await Promise.all(
      objects.map(async item => {
        const signedUrlData = await generateSignedViewUrl({
          key: item.key,
          expiresIn: config.s3SignedUrlExpires || ONE_HOUR_SECONDS
        });

        return {
          key: item.key,
          size: item.size,
          lastModified: item.lastModified,
          eTag: item.eTag,
          signedUrl: signedUrlData.url,
          expiresIn: signedUrlData.expiresIn
        };
      })
    );

    return res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDesignImage = async (req, res, next) => {
  try {
    const { key } = req.body;

    if (!key || typeof key !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'key must be a non-empty string'
      });
    }

    const userId = String(req.user.userId);
    ensureUserOwnsKey({ userId, key });

    await deleteObject(key);

    return res.json({
      success: true,
      message: 'Image deleted successfully',
      data: { key }
    });
  } catch (error) {
    return next(error);
  }
};

export const getDesignImageSignedUrl = async (req, res, next) => {
  try {
    const { key } = req.query;

    if (!key || typeof key !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'key query parameter must be a non-empty string'
      });
    }

    const userId = String(req.user.userId);
    ensureUserOwnsKey({ userId, key: String(key) });

    const signedUrlData = await generateSignedViewUrl({
      key: String(key),
      expiresIn: config.s3SignedUrlExpires || ONE_HOUR_SECONDS
    });

    return res.json({
      success: true,
      data: {
        key: signedUrlData.key,
        signedUrl: signedUrlData.url,
        expiresIn: signedUrlData.expiresIn
      }
    });
  } catch (error) {
    return next(error);
  }
};
