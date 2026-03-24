import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { tasks } from '../../db/schema';
import { eq, and, ilike, asc, desc } from 'drizzle-orm';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const { search, status, category, sortBy, sortOrder } = req.query;

    const filters = [eq(tasks.clientId, parseInt(clientId))];
    if (status) filters.push(eq(tasks.status, status as any));
    if (category) filters.push(eq(tasks.category, category as any));
    if (search) filters.push(ilike(tasks.title, `%${search as string}%`));

    const queryBy = sortBy === 'priority' ? 
      (sortOrder === 'desc' ? desc(tasks.priority) : asc(tasks.priority)) :
      (sortOrder === 'desc' ? desc(tasks.dueDate) : asc(tasks.dueDate));

    const clientTasks = await db.select().from(tasks)
      .where(and(...filters))
      .orderBy(queryBy);

    res.json(clientTasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;

    const [newTask] = await db.insert(tasks).values({
      ...req.body,
      clientId: parseInt(clientId),
    }).returning();

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedTask] = await db.update(tasks)
      .set({ status })
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const getTaskSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const cid = parseInt(clientId);

    const allTasks = await db.select().from(tasks).where(eq(tasks.clientId, cid));
    
    const summary = {
      total: allTasks.length,
      pending: allTasks.filter(t => t.status !== 'Completed').length,
      overdue: allTasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length
    };

    res.json(summary);
  } catch (error) {
    next(error);
  }
};
