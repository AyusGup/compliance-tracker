import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { tasks } from '../../db/schema';
import { eq, sql, and, ilike, asc, desc } from 'drizzle-orm';


export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const { search, status, category, sortBy, sortOrder, page, limit } = req.query as any;

    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, limit);
    const offset = (pageNum - 1) * limitNum;

    const filters = [eq(tasks.clientId, clientId)];
    if (status) filters.push(eq(tasks.status, status as any));
    if (category) filters.push(eq(tasks.category, category as any));
    if (search) filters.push(ilike(tasks.title, `%${search as string}%`));

    const priorityOrder = sql`CASE 
      WHEN ${tasks.priority} = 'High' THEN 3 
      WHEN ${tasks.priority} = 'Medium' THEN 2 
      WHEN ${tasks.priority} = 'Low' THEN 1 
      ELSE 0 
    END`;

    const queryBy = sortBy === 'priority' ? 
      (sortOrder === 'desc' ? desc(priorityOrder) : asc(priorityOrder)) :
      (sortOrder === 'asc' ? asc(tasks.dueDate) : desc(tasks.dueDate));

    const [clientTasks, totalCountResult] = await Promise.all([
      db.select().from(tasks)
        .where(and(...filters))
        .orderBy(queryBy)
        .limit(limitNum)
        .offset(offset),
      db.select({ count: require('drizzle-orm').sql<number>`count(*)` })
        .from(tasks)
        .where(and(...filters))
    ]);

    res.json({
      tasks: clientTasks,
      total: Number(totalCountResult[0].count)
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;

    const [newTask] = await db.insert(tasks).values({
      ...req.body,
      clientId: clientId,
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
      .where(eq(tasks.id, id))
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
    const cid = clientId;

    const [counts] = await db.select({
      total: sql<number>`COUNT(*)`,
      pending: sql<number>`COUNT(*) FILTER (WHERE status != 'Completed')`,
      overdue: sql<number>`COUNT(*) FILTER (WHERE status != 'Completed' AND "due_date" < NOW())`
    })
    .from(tasks)
    .where(eq(tasks.clientId, cid));

    res.json({
      total: Number(counts.total),
      pending: Number(counts.pending),
      overdue: Number(counts.overdue)
    });
  } catch (error) {
    next(error);
  }
};
