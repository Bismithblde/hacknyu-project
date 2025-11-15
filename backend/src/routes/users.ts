import { Router } from 'express';
import { listUsers, getUser, addUser, getUserStatsHandler } from '../controllers/userController';

const router = Router();

router.get('/', listUsers);
router.get('/:id/stats', getUserStatsHandler);
router.get('/:id', getUser);
router.post('/', addUser);

export default router;

