import { Router } from 'express';
import clientRoutes from './clients';
import taskRoutes from './tasks';

const router = Router();

router.use('/clients', clientRoutes);
router.use('/tasks', taskRoutes);

export default router;
