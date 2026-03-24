export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'] as const;
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export const TASK_CATEGORIES = ['GST Filing', 'Income Tax', 'Audit', 'ROC Filing'] as const;

export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskPriority = typeof TASK_PRIORITIES[number];
export type TaskCategory = typeof TASK_CATEGORIES[number];
