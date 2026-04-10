import { User } from '../models/UserSchema.js';
import { Design } from '../models/DesignSchema.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name email phoneNumber isAdmin createdAt updatedAt')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllDesigns = async (req, res, next) => {
  try {
    const designs = await Design.find({})
      .populate('userId', 'name email isAdmin')
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    return next(error);
  }
};
