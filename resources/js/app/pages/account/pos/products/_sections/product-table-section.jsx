import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function ProductTableSection() {
    const { searchTerm, category, currentPage, products } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p?.product?.name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const handleDelete = (name) => alert(`Delete ${name}?`);
    const handleEdit = (name) => alert(`Edit ${name}?`);

    // Define exactly how each column should look and behave
    const columns = [
        {
            header: 'Image',
            accessor: 'image',
            render: (row) => (
                <img
                    src={row.product?.image ?? '/images/product_null.webp'}
                    alt={row.product?.name}
                    className="w-10 h-10 object-contain drop-shadow-sm"
                />
            )
        },
        {
            header: 'Name',
            accessor: 'product_name',
            className: 'font-bold text-slate-800',
            render: (row) => row.product?.name
        },
        {
            header: 'Barcode',
            accessor: 'barcode',
            className: 'text-sm',
            render: (row) => row.product?.barcode
        },
        {
            header: 'Cost Price',
            accessor: 'cost_price',
            className: 'font-semibold text-slate-900',
            render: (row) => peso_value(row?.cost_price)
        },
        {
            header: 'Selling Price',
            accessor: 'sell_price',
            className: 'font-semibold text-slate-900',
            render: (row) => peso_value(row?.sell_price)
        },
        {
            header: 'Stocks',
            accessor: 'stocks',
            className: 'text-sm'
        },
        {
            header: 'Category',
            accessor: 'category_id',
            className: 'text-sm',
            render: (row) => row.product?.category_id
        },
        {
            header: 'Unit',
            accessor: 'unit_id',
            className: 'text-sm',
            render: (row) => row.product?.unit_id
        },
        {
            header: 'Actions',
            accessor: 'action',
            align: 'center',
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(row?.product?.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition"
                    >
                        <Edit2 size={14} /> Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row?.product?.name)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-bold hover:bg-red-600 transition"
                    >
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