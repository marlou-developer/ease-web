import React, { useState } from 'react';
import { 
  Search, Plus, ChevronLeft, ChevronRight, 
  Eye, Lock, Unlock, Layout, ChevronDown, MapPin
} from 'lucide-react';

const CashRegistersTableSection = () => {
  const [registers] = useState([
    { id: 1, name: 'Front Counter', location: 'Main Branch', status: 'Open', balance: 1235.50, initial: 'S', color: 'bg-emerald-500' },
    { id: 2, name: 'Drive-Thru', location: 'Main Branch', status: 'Open', balance: 678.75, initial: 'J', color: 'bg-sky-500' },
    { id: 3, name: 'Main Register', location: 'Downtown Branch', status: 'Closed', balance: 0.00, initial: 'E', color: 'bg-orange-400' },
    { id: 4, name: 'Backup Register', location: 'Mall Kiosk', status: 'Closed', balance: 0.00, initial: 'A', color: 'bg-purple-500' },
  ]);

  const getStatusBadge = (status) => {
    const styles = status === 'Open' 
      ? "bg-emerald-500 text-white" 
      : "bg-red-500 text-white";
    
    return (
      <span className={`px-3 py-1 rounded text-[11px] font-bold uppercase inline-block w-20 text-center ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div >
      {/* Header */}
      <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Layout size={24} />
          Cash Registers
        </div>
        <button className="bg-blue-400/40 hover:bg-blue-400/60 flex items-center gap-1 px-4 py-1.5 rounded-md border border-blue-200/30 transition text-sm font-medium">
          <Plus size={18} /> Add Register
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-gray-100 flex gap-2 items-center bg-gray-50/50">
        <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[180px] text-sm text-gray-600 cursor-pointer">
          <MapPin size={16} className="text-gray-400" />
          <span className="flex-1">All Locations</span>
          <ChevronDown size={14} />
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search cash registers..." 
            className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Name</th>
            <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">Location</th>
            <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-center">Status</th>
            <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {registers.map((reg, index) => (
            <tr key={index} className="hover:bg-blue-50/30 transition">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${reg.color} flex items-center justify-center text-xs text-white font-bold`}>
                    {reg.initial}
                  </div>
                  <span className="text-blue-600 font-semibold cursor-pointer hover:underline">{reg.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 font-medium">{reg.location}</td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-3">
                  {getStatusBadge(reg.status)}
                  <span className="font-bold text-gray-700 min-w-[80px] text-left">
                    ${reg.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">
                    <Eye size={14} /> View
                  </button>
                  {reg.status === 'Open' ? (
                    <button className="flex items-center gap-1 bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-orange-600">
                      <Lock size={14} /> Close Register
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-emerald-700">
                      <Unlock size={14} /> Open Register
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <span>Showing 1 to 4 of 4 cash registers</span>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border rounded bg-gray-100 text-gray-400 cursor-not-allowed">Previous</button>
          <button className="px-4 py-1.5 border rounded bg-white text-gray-400 cursor-not-allowed">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CashRegistersTableSection;