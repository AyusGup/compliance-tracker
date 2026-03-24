import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query as any;
    if (validated.params) req.params = validated.params as any;
    
    return next();
  } catch (error) {
    return next(error);
  }
};
