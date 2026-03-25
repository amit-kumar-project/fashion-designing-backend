import { Design } from '../models/DesignSchema.js';

export const createDesign = async (req, res, next) => {
  try {
    const { title, description, userId, imageUrl, tags = [] } = req.body;
    
    const design = await Design.create({
      title,
      description,
      userId,
      imageUrl,
      tags
    });
    
    return res.status(201).json({
      success: true,
      data: {
        id: design._id,
        title: design.title,
        description: design.description,
        userId: design.userId,
        imageUrl: design.imageUrl,
        tags: design.tags
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getDesignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const design = await Design.findById(id).populate('userId', 'name email');
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    return res.json({
      success: true,
      data: design
    });
  } catch (error) {
    next(error);
  }
};

export const getDesignsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const designs = await Design.find({ userId }).populate('userId', 'name email');
    
    return res.json({
      success: true,
      data: designs
    });
  } catch (error) {
    next(error);
  }
};

export const searchDesigns = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const designs = await Design.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('userId', 'name email');
    
    return res.json({
      success: true,
      data: designs
    });
  } catch (error) {
    next(error);
  }
};

export const updateDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const design = await Design.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    return res.json({
      success: true,
      message: 'Design updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const design = await Design.findByIdAndDelete(id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }

    return res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
