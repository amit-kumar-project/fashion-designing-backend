import { Design } from '../models/DesignSchema.js';

export class DesignController {
  constructor() {
    this.designModel = Design;
  }

  // POST /api/designs
  async createDesign(req, res, next) {
    try {
      const { title, description, userId, imageUrl, tags } = req.body;
      
      const design = await this.designModel.create({
        title,
        description,
        userId,
        imageUrl,
        tags: tags || []
      });
      
      res.status(201).json({
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
  }

  // GET /api/designs/:id
  async getDesignById(req, res, next) {
    try {
      const { id } = req.params;
      const design = await this.designModel.findById(id).populate('userId', 'name email');
      
      if (!design) {
        return res.status(404).json({
          success: false,
          error: 'Design not found'
        });
      }

      res.json({
        success: true,
        data: design
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/designs/user/:userId
  async getDesignsByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const designs = await this.designModel.find({ userId }).populate('userId', 'name email');
      
      res.json({
        success: true,
        data: designs
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/designs/search?q=query
  async searchDesigns(req, res, next) {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search query is required'
        });
      }

      const designs = await this.designModel.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).populate('userId', 'name email');
      
      res.json({
        success: true,
        data: designs
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/designs/:id
  async updateDesign(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const design = await this.designModel.findByIdAndUpdate(
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

      res.json({
        success: true,
        message: 'Design updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/designs/:id
  async deleteDesign(req, res, next) {
    try {
      const { id } = req.params;
      const design = await this.designModel.findByIdAndDelete(id);
      
      if (!design) {
        return res.status(404).json({
          success: false,
          error: 'Design not found'
        });
      }

      res.json({
        success: true,
        message: 'Design deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
