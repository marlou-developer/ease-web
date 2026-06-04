import React, { useState } from "react";
import {
    Edit2,
    Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table"; // <-- Import the reusable Table

const SuppliersTableSection = () => {
    const { suppliers } = useSelector((store) => store.pos);
    console.log('suppliers', suppliers);

    // Define the columns for the reusable table
    const columns = [
        {
            header: 'Name',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div
                        className={`w-8 h-8 rounded-full ${row.color} flex items-center justify-center text-xs text-white font-bold`}
                    >
                        {row.initial}
                    </div>
                    <span className="text-gray-700 font-medium">
                        {row.name}
                    </span>
                </div>
            )
        },
        {
            header: 'Contact Person',
            accessor: 'contact_person',
            className: 'text-gray-600'
        },
        {
            header: 'Contact',
            accessor: 'phone',
            render: (row) => (
                <>
                    <div className="text-gray-600">{row.phone}</div>
                    {row.email && (
                        <div className="text-xs text-blue-500">
                            {row.email}
                        </div>
                    )}
                </>
            )
        },
        {
            header: 'Actions',
            accessor: 'actions',
            render: (row) => (
                <div className="flex gap-2">
                    <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700">
                        <Edit2 size={14} /> Edit
                    </button>
                    <button className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600">
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            {/* The clean, reusable Table component */}
            <Table columns={columns} data={suppliers} />
        </div>
    );
};

export default SuppliersTableSection;