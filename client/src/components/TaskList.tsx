import React, { useState, useEffect } from 'react';
import { getTasks, updateTaskStatus, createTask } from '../api/api';
import { Task, TaskFormInput } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { Search, Filter, Plus, ChevronDown, Calendar, AlertCircle } from 'lucide-react';
import { format, isPast } from 'date-fns';

interface TaskListProps {
  clientId: number;
  onStatusChange?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ clientId, onStatusChange }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    loadTasks();
  }, [clientId, debouncedSearch, statusFilter, categoryFilter, sortBy]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(clientId, { 
        search: debouncedSearch, 
        status: statusFilter, 
        category: categoryFilter,
        sortBy 
      });
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    // Optimistic Update: Update list immediately
    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t));
    
    // Notify parent immediately for optimistic summary refresh (if possible)
    if (onStatusChange) onStatusChange();

    try {
      await updateTaskStatus(taskId, newStatus);
      // No need to reload entire list as we already have optimistic state
    } catch (e) {
      console.error(e);
      setTasks(previousTasks); // Revert on failure
      loadTasks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="GST Filing">GST Filing</option>
            <option value="Income Tax">Income Tax</option>
            <option value="Audit">Audit</option>
            <option value="ROC Filing">ROC Filing</option>
          </select>

          <select 
            className="px-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
          </select>

          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition-all font-semibold shadow-md active:scale-95"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
            <div className="text-center py-12 text-slate-400">Loading tasks...</div>
        ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                No tasks found for this client.
            </div>
        ) : tasks.map(task => {
          const overdue = task.status !== 'Completed' && isPast(new Date(task.dueDate));
          return (
            <div 
              key={task.id} 
              className={`group bg-white p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                overdue ? 'border-rose-100 bg-rose-50/20' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-3">
                    <h4 className={`text-lg font-bold ${overdue ? 'text-rose-900' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    {overdue && (
                      <span className="bg-rose-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                        <AlertCircle size={12} /> Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{task.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`appearance-none px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer outline-none text-center border-none ${
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  <span>{task.category}</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  task.priority === 'High' ? 'text-rose-500' : 
                  task.priority === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full currentColor border`}></span>
                  <span>{task.priority} Priority</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isFormOpen && (
        <TaskForm 
          clientId={clientId} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            loadTasks();
            if (onStatusChange) onStatusChange();
          }} 
        />
      )}
    </div>
  );
};

interface TaskFormProps {
  clientId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ clientId, onClose, onSuccess }) => {
  const [form, setForm] = useState<TaskFormInput>({
    title: '',
    description: '',
    category: 'GST Filing',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'Pending',
    priority: 'Medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTask(clientId, form);
      onSuccess();
    } catch (e) {
      console.error(e);
      alert('Failed to create task. Check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-bold mb-6">Create New Task</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
           <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Title</label>
            <input 
              required
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none"
              placeholder="e.g. GST-R1 Filing"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none"
              rows={3}
              placeholder="Task details..."
              value={form.description || ''}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Category</label>
                <select 
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none"
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                >
                    <option>GST Filing</option>
                    <option>Income Tax</option>
                    <option>Audit</option>
                    <option>ROC Filing</option>
                </select>
            </div>
             <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Due Date</label>
                <input 
                    type="date"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl transition-all outline-none"
                    value={form.dueDate}
                    onChange={e => setForm({...form, dueDate: e.target.value})}
                />
            </div>
          </div>
          
          <div className="pt-6 flex gap-3">
             <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
             >
                Cancel
             </button>
             <button 
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
             >
                {submitting ? 'Saving...' : 'Create Task'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskList;
