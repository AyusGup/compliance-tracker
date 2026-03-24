import { Request, Response, NextFunction } from 'express';
import { db } from '../../db';
import { clients } from '../../db/schema';
import { asc } from 'drizzle-orm';

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allClients = await db.select().from(clients).orderBy(asc(clients.companyName));
    res.json(allClients);
  } catch (error) {
    next(error);
  }
};
