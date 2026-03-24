import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().optional().nullable(),
    category: z.string().min(1, "Category is required"),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    status: z.enum(['Pending', 'In Progress', 'Completed']).default('Pending'),
    priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  })
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'In Progress', 'Completed']),
  })
});

export const getTasksQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
    category: z.string().optional(),
    sortBy: z.enum(['dueDate', 'priority', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
  })
});
