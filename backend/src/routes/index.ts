import { Router } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import authRouter from './auth';

const router = Router();

console.log('📦 Loading routes...');

router.use('/health', healthRouter);
console.log('✅ Health routes registered');

router.use('/users', usersRouter);
console.log('✅ User routes registered');

router.use('/auth', authRouter);
console.log('✅ Auth routes registered');

console.log('📦 All routes loaded successfully');

export default router;

