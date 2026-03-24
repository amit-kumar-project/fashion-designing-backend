import { Design } from '../models/Design.js';

export class DesignController {
  constructor(db) {
    this.designModel = new Design(db);
  }

  // POST /api/designs
  async createDesign(req, res, next) {
    try {
      const { title, description, userId, imageUrl, tags } = req.body;
      
      const result = await this.designModel.create({
        title,
        description,
        userId,
        imageUrl,
        tags: tags || []
      });
      
      res.status(201).json({
        success: true,
        data: {
          id: result.insertedId,
          title,
          description,
          userId,
          imageUrl,
          tags
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
      const design = await this.designModel.findById(id);
      
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
      const designs = await this.designModel.findByUserId(userId);
      
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

      const designs = await this.designModel.search(q);
      
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
      
      const result = await this.designModel.update(id, updateData);
      
      if (result.matchedCount === 0) {
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
      const result = await this.designModel.delete(id);
      
      if (result.deletedCount === 0) {
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
