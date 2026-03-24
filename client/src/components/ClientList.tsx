import { Client } from '../types';

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
  onSelect: (client: Client) => void;
}

const ClientList = ({ clients, selectedClientId, onSelect }: ClientListProps) => {
  return (
    <div className="p-4 space-y-2">
      <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Clients</h3>
      {clients.map(client => (
        <button
          key={client.id}
          onClick={() => onSelect(client)}
          className={`w-full text-left p-4 rounded-xl transition-all duration-200 border-2 ${
            selectedClientId === client.id 
              ? 'bg-indigo-50 border-indigo-600 shadow-sm' 
              : 'border-transparent hover:bg-slate-50'
          }`}
        >
          <div className={`font-semibold ${selectedClientId === client.id ? 'text-indigo-900' : 'text-slate-700'}`}>
            {client.companyName}
          </div>
          <div className="text-xs text-slate-500 mt-1 uppercase tracking-tight">
            {client.country} • {client.entityType}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ClientList;
