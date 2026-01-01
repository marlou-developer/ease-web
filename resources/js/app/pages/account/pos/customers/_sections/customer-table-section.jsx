import React, { useState } from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    Users,
    ChevronDown,
    RotateCcw,
    MapPin,
    Phone,
} from "lucide-react";

const CustomersTableSection = () => {
    const [customers] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            contact: "(123) 456-7890",
            location: "New York, NY",
            totalSales: 1250.0,
            initial: "S",
            color: "bg-emerald-500",
        },
        {
            id: 2,
            name: "John Anderson",
            contact: "(123) 555-1234",
            location: "Los Angeles, CA",
            totalSales: 980.0,
            initial: "J",
            color: "bg-sky-500",
        },
        {
            id: 3,
            name: "Emily Davis",
            contact: "(555) 567-2345",
            location: "Chicago, IL",
            totalSales: 275.0,
            initial: "E",
            color: "bg-orange-400",
        },
        {
            id: 4,
            name: "Michael Brown",
            contact: "(123) 654-9870",
            email: "m.brown@email.com",
            location: "San Francisco, CA",
            totalSales: 1875.0,
            initial: "M",
            color: "bg-red-500",
        },
        {
            id: 5,
            name: "Alice Wilson",
            contact: "(555) 123-4567",
            location: "Houston, TX",
            totalSales: 450.0,
            initial: "A",
            color: "bg-purple-500",
        },
    ]);

    return (
        <div>
            {/* Header */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2 text-xl font-semibold">
                    <Users size={24} />
                    Customers
                </div>
                <button className="bg-blue-400/40 hover:bg-blue-400/60 flex items-center gap-1 px-4 py-1.5 rounded-md border border-blue-200/30 transition text-sm">
                    <Plus size={18} /> Add Customer
                </button>
            </div>

            {/* Filter Bar */}
            <div className="p-3 border-b border-gray-100 flex gap-2 items-center bg-gray-50/50">
                <div className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[160px] text-sm text-gray-600 cursor-pointer hover:bg-gray-50">
                    <BookOpen size={16} className="text-gray-400" />
                    <span className="flex-1">All Groups</span>
                    <ChevronDown size={14} />
                </div>

                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                    />
                </div>

                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition px-2">
                    <RotateCcw size={16} /> Reset
                </button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-100">
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Location
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Total Sales
                        </th>
                        <th className="px-6 py-4 font-medium uppercase text-xs tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {customers.map((c, index) => (
                        <tr
                            key={index}
                            className="hover:bg-blue-50/30 transition"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-xs text-white font-bold`}
                                    >
                                        {c.initial}
                                    </div>
                                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                                        {c.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-600 flex flex-col">
                                    <span>{c.contact}</span>
                                    {c.email && (
                                        <span className="text-xs text-gray-400">
                                            {c.email}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {c.location}
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-700">
                                $
                                {c.totalSales.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}
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

            {/* Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Showing 1 to 5 of 56 customers</span>
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

// Helper Icon Component for header
const BookOpen = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
);

export default CustomersTableSection;
