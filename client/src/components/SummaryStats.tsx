import React, { useState, useEffect } from 'react';
import { getTaskSummary } from '../api/api';
import { TaskSummary } from '../types';
import { Clock, CheckCircle, AlertTriangle, ListChecks } from 'lucide-react';

interface SummaryStatsProps {
  clientId: number;
  refreshTrigger?: number;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ clientId, refreshTrigger }) => {
  const [summary, setSummary] = useState<TaskSummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, [clientId, refreshTrigger]);

  const loadSummary = async () => {
    try {
      const data = await getTaskSummary(clientId);
      setSummary(data);
    } catch (e) {
      console.error(e);
    }
  };

  if (!summary) return null;

  const stats = [
    { label: 'Total Tasks', value: summary.total, icon: <ListChecks size={20} />, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Pending', value: summary.pending, icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-700' },
    { label: 'Overdue', value: summary.overdue, icon: <AlertTriangle size={20} />, color: 'bg-rose-50 text-rose-700 font-bold' },
    { label: 'Completed', value: summary.total - summary.pending, icon: <CheckCircle size={20} />, color: 'bg-emerald-50 text-emerald-700' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-2xl border-2 border-transparent bg-white shadow-sm ring-1 ring-slate-200 flex items-center gap-5 transition-transform hover:scale-105 duration-200`}>
          <div className={`p-3 rounded-xl ${stat.color}`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.label === 'Overdue' ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;
