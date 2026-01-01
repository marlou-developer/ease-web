import React from 'react';
import { 
  Search, Plus, ChevronLeft, ChevronRight, 
  ArrowUp, ArrowDown, Settings, RotateCcw,
  BookOpen, ChevronDown, Calendar, Filter
} from 'lucide-react';

const StackMovementTableSection = () => {
  // Mock data mapping to your specific Laravel Schema
  const movements = [
    { id: 1, product: "Coca-Cola 1L", type: "IN", qty_change: 20, reference: "REF1001", user: "Admin", date: "Jan 04, 2026", img: "🥤" },
    { id: 2, product: "Tide Powder", type: "OUT", qty_change: -10, reference: "REF1002", user: "Staff", date: "Jan 04, 2026", img: "📦" },
    { id: 3, product: "Safeguard Soap", type: "ADJUST", qty_change: 5, reference: "REF1003", user: "Manager", date: "Jan 03, 2026", img: "🧼" },
    { id: 4, product: "Noodles Pack", type: "OUT", qty_change: -8, reference: "REF1004", user: "Admin", date: "Jan 03, 2026", img: "🍜" },
    { id: 5, product: "Milo 1kg", type: "IN", qty_change: 15, reference: "REF1005", user: "Admin", date: "Jan 02, 2026", img: "☕" },
  ];

  const getTypeStyle = (type) => {
    switch(type) {
      case 'IN': return 'bg-blue-600 text-white';
      case 'OUT': return 'bg-orange-400 text-white';
      case 'ADJUST': return 'bg-emerald-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeName = (type) => {
    if(type === 'IN') return 'Addition';
    if(type === 'OUT') return 'Deduction';
    return 'Adjustment';
  };

  return (
    <div className="  font-sans">
    
        
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <BookOpen size={24} />
            Stock Movement
          </div>
          <button className="bg-blue-400/30 hover:bg-blue-400/50 flex items-center gap-1 px-4 py-1.5 rounded-md border border-blue-300/50 transition text-sm">
            <Plus size={18} /> Add Movement
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2 items-center bg-gray-50/50">
          <div className="relative flex-grow min-w-[300px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search product, reference, or supplier..." 
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
            />
          </div>
          <FilterButton icon={<Filter size={16}/>} label="Movement Type" />
          <FilterButton icon={<Calendar size={16}/>} label="Date Range" />
          <FilterButton label="Category" />
          <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition">
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <StatCard color="bg-green-50" border="border-green-200" icon={<ArrowUp className="text-green-600"/>} value="+245" label="Additions Today" />
          <StatCard color="bg-red-50" border="border-red-200" icon={<ArrowDown className="text-red-600"/>} value="-178" label="Deductions Today" />
          <StatCard color="bg-orange-50" border="border-orange-200" icon={<ArrowDown className="text-orange-600"/>} value="+12" label="Adjustments Today" />
          <StatCard color="bg-blue-50" border="border-blue-200" icon={<Settings className="text-blue-600"/>} value="9,820" label="Current In-Stock" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Qty</th>
                <th className="px-6 py-3">Reference</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {movements.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-xl shadow-sm border border-gray-200">
                      {item.img}
                    </div>
                    <span className="font-bold text-gray-700">{item.product}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded text-xs font-semibold inline-block w-24 text-center ${getTypeStyle(item.type)}`}>
                      {getTypeName(item.type)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-bold text-lg ${item.qty_change > 0 ? 'text-gray-700' : 'text-orange-600'}`}>
                    {item.qty_change > 0 ? `+${item.qty_change}` : item.qty_change}
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{item.reference}</td>
                  <td className="px-6 py-4 text-gray-600">{item.user}</td>
                  <td className="px-6 py-4 text-gray-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-1 rounded border border-gray-300 text-blue-600 font-medium text-sm hover:bg-blue-50 transition">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50/50">
          <span className="text-sm text-gray-500">Showing 1 to 5 of 25 entries</span>
          <div className="flex gap-1">
            <PaginationButton label="Previous" />
            <PaginationButton label="1" active />
            <PaginationButton label="2" />
            <PaginationButton label="3" />
            <PaginationButton label="Next" icon={<ChevronRight size={16}/>} />
          </div>
        </div>
    </div>
  );
};

// Sub-components for cleaner code
const StatCard = ({ color, border, icon, value, label }) => (
  <div className={`${color} border ${border} p-4 rounded-lg flex items-center gap-4`}>
    <div className="p-2 bg-white/50 rounded-lg">{icon}</div>
    <div>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500 font-medium uppercase tracking-tighter">units</span>
      </div>
      <div className="text-xs text-gray-500 font-medium">{label}</div>
    </div>
  </div>
);

const FilterButton = ({ label, icon }) => (
  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 bg-white">
    {icon}
    {label}
    <ChevronDown size={14} />
  </button>
);

const PaginationButton = ({ label, active, icon }) => (
  <button className={`px-4 py-1.5 rounded text-sm font-medium border transition flex items-center gap-1 ${
    active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
  }`}>
    {label} {icon}
  </button>
);

export default StackMovementTableSection;