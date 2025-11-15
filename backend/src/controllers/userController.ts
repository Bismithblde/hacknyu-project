import { Request, Response } from 'express';
import { getAllUsers, getUserById, createUser, getUserStats, UserStats } from '../services/userService';
import { ApiResponse, User } from '../types';
import { isValidId, isValidString, isValidEmail } from '../utils/validation';

export const listUsers = (_req: Request, res: Response<ApiResponse<User[]>>) => {
  try {
    const users = getAllUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export const getUser = (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const user = getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

export const addUser = (req: Request, res: Response<ApiResponse<User>>) => {
  try {
    const { name, email } = req.body;

    if (!isValidString(name)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing name',
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing email format',
      });
    }

    const newUser = createUser({ name, email });
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
};

export const getUserStatsHandler = (req: Request, res: Response<ApiResponse<UserStats>>) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const stats = getUserStats(id);

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
    });
  }
};

