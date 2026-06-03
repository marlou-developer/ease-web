import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    RotateCcw,
    Trash2,
    BookOpen,
    Truck,
} from "lucide-react";
import { useSelector } from "react-redux";

const TableFilterSection = () => {
    return (
        <div className="font-sans">

            <div className="p-3 border-b border-gray-100 flex flex-wrap gap-3 items-center bg-gray-50/50">
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[180px] flex-grow md:flex-grow-0 text-sm text-gray-600">
                    <Truck size={16} className="text-gray-400" />
                    <span className="flex-1">All Customers</span>
                    <ChevronDown size={14} />
                </div>

                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search purchase orders..."
                        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <FilterDropdown label="Status" />
                    <FilterDropdown label="Date Range" />
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition ml-2">
                        <RotateCcw size={16} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilterDropdown = ({ label }) => (
    <button className="flex-1 md:flex-none flex justify-between items-center gap-2 px-3 py-2 border rounded bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-200 rounded-sm flex flex-col gap-[2px] p-[2px]">
                <div className="h-[2px] bg-gray-300 w-full"></div>
                <div className="h-[2px] bg-gray-300 w-2/3"></div>
                <div className="h-[2px] bg-gray-300 w-1/2"></div>
            </div>
            {label}
        </div>
        <ChevronDown size={14} />
    </button>
);

export default TableFilterSection;