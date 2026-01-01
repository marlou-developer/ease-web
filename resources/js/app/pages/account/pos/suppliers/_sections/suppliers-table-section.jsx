import React, { useState } from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    BookOpen,
    ChevronDown,
} from "lucide-react";

const SuppliersTableSection = () => {
    const [suppliers] = useState([
        {
            id: 1,
            name: "Fresh Produce Ltd",
            contact: "John Smith",
            phone: "(123) 456-7890",
            initial: "F",
            color: "bg-emerald-500",
        },
        {
            id: 2,
            name: "Dairy Best Co.",
            contact: "Mary Johnson",
            phone: "(123) 555-2345",
            initial: "D",
            color: "bg-sky-400",
        },
        {
            id: 3,
            name: "Bakery Supplies Inc.",
            contact: "Michael Lee",
            phone: "...",
            initial: "B",
            color: "bg-orange-400",
        },
        {
            id: 4,
            name: "Global Beverages",
            contact: "David Wang",
            phone: "(555) 678-1234",
            initial: "G",
            color: "bg-red-500",
        },
        {
            id: 5,
            name: "TechnoGroceries Ltd",
            contact: "Sarah Smith",
            phone: "(456) 789-4567",
            email: "sarah@techgroceries.com",
            initial: "T",
            color: "bg-purple-500",
        },
        {
            id: 6,
            name: "TechnoGroceries Ltd",
            contact: "Anh Tra",
            phone: "(456) 789-4567",
            email: "anhtra@groceries.com",
            initial: "T",
            color: "bg-purple-600",
        },
    ]);

    return (
        <div>
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <BookOpen size={24} />
                    Suppliers
                </div>
                <button className="bg-blue-400/40 hover:bg-blue-400/60 flex items-center gap-1 px-4 py-1.5 rounded-md border border-blue-200/30 transition text-sm">
                    <Plus size={18} /> Add Supplier
                </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3 border-b border-gray-100 flex gap-2 items-center bg-gray-50/50">
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[180px] text-sm text-gray-600 cursor-pointer">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="flex-1">All Categories</span>
                    <ChevronDown size={14} />
                </div>

                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search suppliers..."
                        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Contact Person
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Phone
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {suppliers.map((s, index) => (
                        <tr
                            key={index}
                            className="hover:bg-blue-50/30 transition"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-xs text-white font-bold`}
                                    >
                                        {s.initial}
                                    </div>
                                    <span className="text-gray-700 font-medium">
                                        {s.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {s.contact}
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-600">{s.phone}</div>
                                {s.email && (
                                    <div className="text-xs text-blue-500">
                                        {s.email}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">
                                        <Edit2 size={14} /> Edit
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

            {/* Pagination */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1 to 5 of 12 suppliers</span>
                <div className="flex gap-1">
                    <button className="px-4 py-1.5 border rounded bg-gray-100 text-gray-600">
                        Previous
                    </button>
                    <button className="px-4 py-1.5 border rounded bg-blue-600 text-white font-bold">
                        1
                    </button>
                    <button className="px-4 py-1.5 border rounded bg-white text-gray-600">
                        2
                    </button>
                    <button className="px-4 py-1.5 border rounded bg-white text-gray-600">
                        3
                    </button>
                    <button className="px-4 py-1.5 border rounded bg-white text-gray-600 flex items-center gap-1">
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuppliersTableSection;
