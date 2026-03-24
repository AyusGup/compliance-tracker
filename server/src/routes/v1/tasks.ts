import { Router } from 'express';
import { getTasks, createTask, updateTaskStatus, getTaskSummary } from '../../controllers/v1/tasks';
import { validate } from '../../middleware/validate';
import { createTaskSchema, updateTaskStatusSchema, getTasksQuerySchema } from '../../zod';

const router = Router();

router.get('/client/:clientId', validate(getTasksQuerySchema), getTasks);
router.post('/client/:clientId', validate(createTaskSchema), createTask);
router.put('/:id/status', validate(updateTaskStatusSchema), updateTaskStatus);
router.get('/client/:clientId/summary', getTaskSummary);

export default router;
