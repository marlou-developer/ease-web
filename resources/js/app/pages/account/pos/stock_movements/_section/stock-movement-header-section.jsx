import {
    BookOpen,
    Calendar,
    ChevronDown,
    Filter,
    Plus,
    RotateCcw,
    Search,
} from "lucide-react";
import React from "react";

export default function StockMovementHeaderSection() {
    const FilterButton = ({ label, icon }) => (
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100 bg-white">
            {icon}
            {label}
            <ChevronDown size={14} />
        </button>
    );
    return (
        <>
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
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search product, reference, or supplier..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
                    />
                </div>
                <FilterButton
                    icon={<Filter size={16} />}
                    label="Movement Type"
                />
                <FilterButton
                    icon={<Calendar size={16} />}
                    label="Date Range"
                />
                <FilterButton label="Category" />
                <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition">
                    <RotateCcw size={20} />
                </button>
            </div>
        </>
    );
}
