import React, { useState } from "react";
import {
    Search,
    ChevronDown,
    RotateCcw,
    Trash2,
    BookOpen,
    Truck,
} from "lucide-react";
import AddPurchasesSection from "./add-purchases-section";
import { useSelector } from "react-redux";
// import ViewPurchasesSection from "./view-purchases-section";
import moment from "moment";
import Table from "@/app/_components/table";
import ViewPurchasesSection from "./view-purchases-section";

const PurchaseTableSection = () => {
    const { purchases } = useSelector((store) => store.pos);

    // Merged and unified status styles
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "paid":
                return "bg-emerald-100 text-emerald-700 border border-emerald-200";
            case "pending":
                return "bg-orange-100 text-orange-700 border border-orange-200";
            case "received":
                return "bg-sky-100 text-sky-700 border border-sky-200";
            case "addition":
                return "bg-blue-100 text-blue-700 border border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-200";
        }
    };

    const columns = [
        {
            header: 'REF #',
            accessor: 'reference_no'
        },
        {
            header: 'Supplier',
            accessor: 'pos_supplier_id',
            className: 'font-bold text-gray-700',
            render: (row) => (
                <div>{row?.supplier?.name}</div>
            )
        },
        {
            header: 'Total',
            accessor: 'total_amount',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Status',
            accessor: 'status',
            align: 'center',
            render: (row) => (
                <span className={`px-4 py-1 rounded text-[11px] font-bold inline-block w-24 uppercase text-center ${getStatusStyle(row?.status)}`}>
                    {row?.status}
                </span>
            )
        },
        {
            header: 'Date',
            accessor: 'created_at',
            className: 'text-gray-500',
            render: (row) => moment(row?.created_at).format('LLL')
        },
        {
            header: 'Actions',
            accessor: 'actions',
            align: 'right',
            disableSort: true,
            render: (row) => (
                <div className="flex justify-end gap-2">
                    <ViewPurchasesSection props_data={row} />
                    <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors">
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="font-sans">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold flex-1">
                    <BookOpen size={24} />
                    Purchases
                </div>
                <AddPurchasesSection />
            </div>

            {/* Filters - Added flex-wrap for mobile responsiveness */}
            <div className="p-3 border-b border-gray-100 flex flex-wrap gap-3 items-center bg-gray-50/50">
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[180px] flex-grow md:flex-grow-0 text-sm text-gray-600">
                    <Truck size={16} className="text-gray-400" />
                    <span className="flex-1">All Suppliers</span>
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

            {/* Table */}
            <Table columns={columns} data={purchases} />


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

export default PurchaseTableSection;