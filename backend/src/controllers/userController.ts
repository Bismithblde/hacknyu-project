import { Request, Response } from 'express';
import { getAllUsers, getUserById, createUser } from '../services/userService';
import { ApiResponse, User } from '../types';

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

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
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

