import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function ProductTableSection() {
    const { searchTerm, category, currentPage, customers } = useSelector(
        (store) => store.pos,
    );
    const dispatch = useDispatch();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = customers?.filter((p) => {
        const matchesSearch = p?.name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts?.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const handleDelete = (name) => alert(`Delete ${name}?`);
    const handleEdit = (name) => alert(`Edit ${name}?`);

    // Define exactly how each column should look and behave
    const columns = [
        {
            header: "Customer #",
            accessor: "id",
        },
        {
            header: "Customers",
            accessor: "name",
            className: "font-bold text-gray-700",
        },
        {
            header: "Email",
            accessor: "email",
            className: "font-bold text-gray-700",
        },
        {
            header: "Contact",
            accessor: "phone",
            className: "font-bold text-gray-700",
        },
        {
            header: "Address",
            accessor: "address",
            className: "font-bold text-gray-700",
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "font-bold text-gray-700",
        },
        // {
        //     header: 'Status',
        //     accessor: 'status',
        //     align: 'center',
        //     render: (row) => (
        //         <span className={`px-4 py-1 rounded text-[11px] font-bold inline-block w-24 uppercase text-center ${getStatusStyle(row?.status)}`}>
        //             {row?.status}
        //         </span>
        //     )
        // },
    ];

    return (
        <>
            <Table columns={columns} data={currentItems} />
        </>
    );
}
