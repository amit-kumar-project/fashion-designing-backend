import { User } from '../models/User.js';

export class UserController {
  constructor(db) {
    this.userModel = new User(db);
  }

  // POST /api/users
  async createUser(req, res, next) {
    try {
      const { email, name, password } = req.body;
      
      // Check if user already exists
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      const result = await this.userModel.create({ email, name, password });
      
      res.status(201).json({
        success: true,
        data: {
          id: result.insertedId,
          email,
          name
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/users/:id
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.userModel.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/users/:id
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Remove sensitive fields
      delete updateData.password;
      
      const result = await this.userModel.update(id, updateData);
      
      if (result.matchedCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/users/:id
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const result = await this.userModel.delete(id);
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
