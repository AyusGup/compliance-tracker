import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../constants";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional().nullable(),
    category: z.string().min(1, "Category is required"),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    status: z.enum(TASK_STATUSES).default('Pending'),
    priority: z.enum(TASK_PRIORITIES).default('Medium'),
  })
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(TASK_STATUSES),
  })
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.preprocess((v) => v === '' ? undefined : v, z.enum(TASK_STATUSES).optional()),
    category: z.preprocess((v) => v === '' ? undefined : v, z.string().optional()),
    sortBy: z.preprocess((v) => v === '' ? undefined : v, z.enum(['dueDate', 'priority', 'status']).optional()),
    sortOrder: z.preprocess((v) => v === '' ? undefined : v, z.enum(['asc', 'desc']).optional().default('asc')),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10)
  })
});
