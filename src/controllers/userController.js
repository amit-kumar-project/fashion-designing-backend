import { User } from '../models/UserSchema.js';

export class UserController {
  constructor() {
    this.userModel = User;
  }

  // POST /api/users
  async createUser(req, res, next) {
    try {
      const { email, name, password } = req.body;
      
      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      const user = await this.userModel.create({ email, name, password });
      
      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name
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
      const user = await this.userModel.findById(id).select('-password');
      
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
      
      const user = await this.userModel.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true, runValidators: true }
      );
      
      if (!user) {
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
      const user = await this.userModel.findByIdAndDelete(id);
      
      if (!user) {
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
