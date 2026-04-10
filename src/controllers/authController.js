import { User } from '../models/UserSchema.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const generateAccessToken = user => jwt.sign(
  {
    userId: user._id,
    isAdmin: user.isAdmin
  },
  config.jwtSecret,
  { expiresIn: config.jwtExpire }
);

const sanitizeUser = user => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  isAdmin: user.isAdmin
});

const validateSignupData = ({ name, email, phoneNumber, password, confirmPassword }) => {
  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    return { isValid: false, error: 'All fields are required' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  return { isValid: true };
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password, confirmPassword } = req.body || {};
    
    const validation = validateSignupData({ name, email, phoneNumber, password, confirmPassword });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const [existingUser, existingPhone] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ phoneNumber })
    ]);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this phone number'
      });
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
      isAdmin: false
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (!config.jwtSecret) {
      return res.status(500).json({
        success: false,
        error: 'JWT_SECRET is not configured'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    const accessToken = generateAccessToken(user);

    return res.json({
      success: true,
      message: 'Login successful',
      accessToken,
      expiresIn: config.jwtExpire,
      data: sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body || {};
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent'
      });
    }

    return res.json({
      success: true,
      message: 'Password reset link has been sent to your email',
      data: {
        email: user.email,
        resetToken: `sample-reset-token-${Date.now()}`
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body || {};
    
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};
