import axios from 'axios';
import { Client, Task, TaskFormInput, TaskSummary } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

export const getClients = async (): Promise<Client[]> => {
  const { data } = await api.get('/clients');
  return data;
};

export const getTasks = async (
  clientId: string, 
  filters: { search?: string; status?: string; category?: string; sortBy?: string; sortOrder?: string; page?: number; limit?: number } = {}
): Promise<{ tasks: Task[]; total: number }> => {
  const { data } = await api.get(`/tasks/client/${clientId}`, { params: filters });
  return data;
};

export const getTaskSummary = async (clientId: string): Promise<TaskSummary> => {
  const { data } = await api.get(`/tasks/client/${clientId}/summary`);
  return data;
};

export const createTask = async (clientId: string, task: TaskFormInput): Promise<Task> => {
  const { data } = await api.post(`/tasks/client/${clientId}`, task);
  return data;
};

export const updateTaskStatus = async (taskId: string, status: string): Promise<Task> => {
  const { data } = await api.put(`/tasks/${taskId}/status`, { status });
  return data;
};


