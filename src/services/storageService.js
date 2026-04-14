import { randomUUID } from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config/env.js';

const resolveStorageConfig = () => ({
  endpoint: config.s3Endpoint || process.env.S3_ENDPOINT,
  region: config.s3Region || process.env.S3_REGION || 'ap-southeast-1',
  accessKeyId: config.s3AccessKeyId || process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: config.s3SecretAccessKey || process.env.S3_SECRET_ACCESS_KEY,
  bucket: config.s3Bucket || process.env.S3_BUCKET,
  signedUrlExpires: Number(config.s3SignedUrlExpires || process.env.S3_SIGNED_URL_EXPIRES || 3600)
});

const getMissingStorageConfig = storageConfig => [
  ['S3_ENDPOINT', storageConfig.endpoint],
  ['S3_ACCESS_KEY_ID', storageConfig.accessKeyId],
  ['S3_SECRET_ACCESS_KEY', storageConfig.secretAccessKey],
  ['S3_BUCKET', storageConfig.bucket]
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

const assertStorageConfigured = () => {
  const storageConfig = resolveStorageConfig();
  const missing = getMissingStorageConfig(storageConfig);

  if (missing.length > 0) {
    const error = new Error(`Storage is not configured. Missing: ${missing.join(', ')}`);
    error.statusCode = 500;
    throw error;
  }

  return storageConfig;
};

let s3Client;
let cachedClientSignature;

const getS3Client = () => {
  const storageConfig = assertStorageConfigured();
  const signature = `${storageConfig.endpoint}|${storageConfig.region}|${storageConfig.accessKeyId}|${storageConfig.bucket}`;

  if (!s3Client || cachedClientSignature !== signature) {
    s3Client = new S3Client({
      endpoint: storageConfig.endpoint,
      region: storageConfig.region,
      forcePathStyle: true,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey
      }
    });
    cachedClientSignature = signature;
  }

  return { client: s3Client, storageConfig };
};

const sanitizeFileName = fileName => fileName
  .toLowerCase()
  .replace(/[^a-z0-9._-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '') || 'image';

const normalizeObjectKey = key => key.replace(/^\/+/, '');

export const buildUserDesignImageKey = ({ userId, originalName }) => {
  const safeName = sanitizeFileName(originalName);
  const uniquePrefix = `${Date.now()}-${randomUUID()}`;
  return `users/${userId}/designs/${uniquePrefix}-${safeName}`;
};

export const isUserDesignObjectKey = ({ userId, key }) => {
  const normalizedKey = normalizeObjectKey(key);
  return normalizedKey.startsWith(`users/${userId}/designs/`);
};

export const uploadObject = async ({ key, body, contentType }) => {
  const { client, storageConfig } = getS3Client();
  const normalizedKey = normalizeObjectKey(key);

  const command = new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: normalizedKey,
    Body: body,
    ContentType: contentType
  });

  await client.send(command);

  return {
    bucket: storageConfig.bucket,
    key: normalizedKey
  };
};

export const deleteObject = async key => {
  const { client, storageConfig } = getS3Client();
  const normalizedKey = normalizeObjectKey(key);

  const command = new DeleteObjectCommand({
    Bucket: storageConfig.bucket,
    Key: normalizedKey
  });

  await client.send(command);

  return {
    bucket: storageConfig.bucket,
    key: normalizedKey
  };
};

export const generateSignedViewUrl = async ({ key, expiresIn }) => {
  const { client, storageConfig } = getS3Client();
  const normalizedKey = normalizeObjectKey(key);
  const ttlSeconds = Number(expiresIn || storageConfig.signedUrlExpires || 3600);

  const command = new GetObjectCommand({
    Bucket: storageConfig.bucket,
    Key: normalizedKey
  });

  const url = await getSignedUrl(client, command, {
    expiresIn: ttlSeconds
  });

  return {
    key: normalizedKey,
    url,
    expiresIn: ttlSeconds
  };
};

export const listUserDesignObjects = async ({ userId }) => {
  const { client, storageConfig } = getS3Client();
  const prefix = `users/${userId}/designs/`;
  const objects = [];
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: storageConfig.bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken
    });

    const response = await client.send(command);
    objects.push(...(response.Contents || []));
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects.map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
    eTag: item.ETag
  }));
};

export const listGalleryObjects = async () => {
  const { client, storageConfig } = getS3Client();
  const prefix = 'gallery/';
  const objects = [];
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: storageConfig.bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken
    });

    const response = await client.send(command);
    objects.push(...(response.Contents || []));
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return objects.map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
    eTag: item.ETag
  }));
};
