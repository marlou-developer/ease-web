import React, { useState } from "react";
import {
    Search,
    Plus,
    ChevronDown,
    Calendar,
    RotateCcw,
    Eye,
    Trash2,
    BookOpen,
    Truck,
} from "lucide-react";

const PurchaseTableSection = () => {
    const [purchases] = useState([
        {
            id: "PO-001",
            supplier: "Fresh Produce Ltd",
            initial: "F",
            total: 1200.0,
            status: "Completed",
            date: "Apr 5, 2024",
            color: "bg-blue-400",
        },
        {
            id: "PO-002",
            supplier: "Dairy Best Co.",
            initial: "D",
            total: 750.0,
            status: "Pending",
            date: "Apr 3, 2024",
            color: "bg-sky-400",
        },
        {
            id: "PO-003",
            supplier: "Bakery Supplies Inc.",
            initial: "B",
            total: 1050.0,
            status: "Received",
            date: "Apr 1, 2024",
            color: "bg-cyan-400",
        },
        {
            id: "PO-004",
            supplier: "Global Beverages",
            initial: "G",
            total: 565.0,
            status: "Received",
            date: "Mar 30, 2024",
            color: "bg-indigo-400",
        },
        {
            id: "PO-005",
            supplier: "TechnoGroceries Ltd",
            initial: "T",
            total: 1300.0,
            status: "Addition",
            date: "Mar 28, 2024",
            color: "bg-blue-500",
        },
        {
            id: "PO-006",
            supplier: "Pavérage",
            initial: "S",
            total: 1300.0,
            status: "Received",
            date: "Mar 28, 2024",
            color: "bg-slate-400",
        },
    ]);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-emerald-500 text-white";
            case "pending":
                return "bg-orange-400 text-white";
            case "received":
                return "bg-sky-400 text-white";
            case "addition":
                return "bg-emerald-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    return (
        <div className=" font-sans">
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <BookOpen size={24} />
                    Purchases
                </div>
                <button className="bg-blue-400/40 hover:bg-blue-400/60 flex items-center gap-1 px-4 py-1.5 rounded-md border border-blue-200/30 transition text-sm">
                    <Plus size={18} /> New Purchase
                </button>
            </div>

            {/* Filters */}
            <div className="p-3 border-b border-gray-100 flex gap-2 items-center bg-gray-50/50">
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[180px] text-sm text-gray-600">
                    <Truck size={16} className="text-gray-400" />
                    <span className="flex-1">All Suppliers</span>
                    <ChevronDown size={14} />
                </div>

                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search purchase orders..."
                        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    />
                </div>

                <FilterDropdown label="Status" />
                <FilterDropdown label="Date Range" />

                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition ml-2">
                    <RotateCcw size={16} /> Reset
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            PO #
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Total
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-center">
                            Status
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {purchases.map((po) => (
                        <tr
                            key={po.id}
                            className="hover:bg-blue-50/30 transition"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-blue-600 font-semibold">
                                        {po.id}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-6 h-6 rounded-full ${po.color} flex items-center justify-center text-[10px] text-white font-bold`}
                                        >
                                            {po.initial}
                                        </div>
                                        <span className="text-gray-700 font-medium">
                                            {po.supplier}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-700">
                                $
                                {po.total.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span
                                    className={`px-4 py-1 rounded text-[11px] font-bold inline-block w-24 uppercase ${getStatusStyle(
                                        po.status
                                    )}`}
                                >
                                    {po.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {po.date}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                    <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">
                                        <Eye size={14} /> View
                                    </button>
                                    <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer/Pagination */}
            <div className="p-4 bg-gray-50/50 flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1 to 5 of 18 purchase orders</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200">
                        Previous
                    </button>
                    <button className="px-3 py-1 border rounded bg-blue-600 text-white">
                        1
                    </button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">
                        2
                    </button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">
                        3
                    </button>
                    <button className="px-3 py-1 border rounded bg-white hover:bg-gray-100">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilterDropdown = ({ label }) => (
    <button className="flex items-center gap-2 px-3 py-2 border rounded bg-white text-sm text-gray-600 hover:bg-gray-50">
        <div className="w-4 h-4 border-2 border-gray-200 rounded-sm flex flex-col gap-[2px] p-[2px]">
            <div className="h-[2px] bg-gray-300 w-full"></div>
            <div className="h-[2px] bg-gray-300 w-2/3"></div>
            <div className="h-[2px] bg-gray-300 w-1/2"></div>
        </div>
        {label}
        <ChevronDown size={14} />
    </button>
);

export default PurchaseTableSection;
