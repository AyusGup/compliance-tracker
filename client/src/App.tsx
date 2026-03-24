import { useState, useEffect } from 'react';
import { getClients } from './api/api';
import { Client } from './types';
import ClientList from './components/ClientList';
import TaskList from './components/TaskList';
import SummaryStats from './components/SummaryStats';
import { Layout, Menu, X } from 'lucide-react';

const App = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) setSelectedClient(data[0]);
    } catch (error) {
      console.error('Failed to load clients', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-inter w-full relative">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Layout size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Compliance</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800 p-1">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ClientList
            clients={clients}
            selectedClientId={selectedClient?.id}
            onSelect={(c) => {
              setSelectedClient(c);
              setIsSidebarOpen(false); // close sidebar on selection in mobile
            }}
          />
        </div>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">

        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-4 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600 hover:text-indigo-600 p-1 transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-lg tracking-tight">Compliance Tracker</h1>
        </header>

        {selectedClient ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedClient.companyName}</h2>
              <div className="flex gap-4 text-slate-500 text-sm">
                <span>{selectedClient.country}</span>
                <span>•</span>
                <span>{selectedClient.entityType}</span>
              </div>
            </header>

            <SummaryStats clientId={selectedClient.id} refreshTrigger={refreshTrigger} />
            <TaskList clientId={selectedClient.id} onStatusChange={triggerRefresh} />
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-slate-400">
            Select a client to view tasks
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
