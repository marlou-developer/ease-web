import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewPurchasesSection from "./view-purchases-section";
// import StockingSection from "..."; // Make sure to import this if you use it!


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

export default function ProductTableSection() {
    const { searchTerm, category, currentPage, purchases } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = purchases?.filter((p) => {
        const matchesSearch = p?.reference_no
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts?.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handleDelete = (name) => alert(`Delete ${name}?`);
    const handleEdit = (name) => alert(`Edit ${name}?`);

    // Define exactly how each column should look and behave
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
        <>
            <Table
                columns={columns}
                data={currentItems}
            />
        </>
    );
}