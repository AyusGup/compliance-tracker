export interface Client {
  id: number;
  companyName: string;
  country: string;
  entityType: string;
}

export interface Task {
  id: number;
  clientId: number;
  title: string;
  description: string | null;
  category: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string | null;
}

export type TaskFormInput = Omit<Task, 'id' | 'clientId' | 'createdAt'>;

export interface TaskSummary {
  total: number;
  pending: number;
  overdue: number;
}
