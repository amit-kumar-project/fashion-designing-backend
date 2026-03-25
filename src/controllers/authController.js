import { User } from '../models/UserSchema.js';

export class AuthController {
  constructor() {
    this.userModel = User;
  }

  // POST /api/auth/signup
  async signup(req, res, next) {
    try {
      const { name, email, phoneNumber, password, confirmPassword } = req.body;
      
      // Validation
      if (!name || !email || !phoneNumber || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Passwords do not match'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Check if phone number already exists
      const existingPhone = await this.userModel.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          error: 'User already exists with this phone number'
        });
      }

      // Create user
      const user = await this.userModel.create({
        name,
        email,
        phoneNumber,
        password // In production, hash this password using bcrypt
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Find user
      const user = await this.userModel.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Check password (In production, use bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      
      // Validation
      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      // Find user
      const user = await this.userModel.findOne({ email });
      if (!user) {
        // For security, don't reveal if email exists
        return res.json({
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent'
        });
      }

      // In production, generate reset token and send email
      // For now, just return success
      res.json({
        success: true,
        message: 'Password reset link has been sent to your email',
        data: {
          email: user.email,
          // In production, you would send an actual reset link via email
          resetToken: 'sample-reset-token-' + Date.now()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req, res, next) {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      
      // Validation
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Passwords do not match'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long'
        });
      }

      // Find user
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Update password (In production, hash the password)
      await this.userModel.findByIdAndUpdate(user._id, {
        password: newPassword
      });

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
