import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductEditSection from "./product-edit-section";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function ProductTableSection() {
    const { searchTerm, category, currentPage, store_stocks } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = store_stocks?.filter((p) => {
        const term = searchTerm.toLowerCase();

        // 1. Gather all the fields you want to search through
        const searchableFields = [
            p?.id,
            p?.product?.name,
            p?.product?.barcode,
            p?.cost_price,
            p?.selling_price,
            p?.stocks,
            p?.product?.category?.name,
            p?.product?.unit?.name
        ];

        // 2. Check if ANY of those fields contain the search term
        const matchesSearch = searchableFields.some(field =>
            // Convert the field to a string safely (handling nulls) and check for the term
            String(field ?? '').toLowerCase().includes(term)
        );

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
            header: 'ID',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.id
        },
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
            render: (row) => peso_value(row?.cost_price ?? 0)
        },
        {
            header: 'Selling Price',
            accessor: 'selling_price',
            className: 'font-semibold text-slate-900',
            render: (row) => peso_value(row?.selling_price ?? 0)
        },
        {
            header: 'Stocks',
            accessor: 'stocks',
            className: 'text-sm'
        },
        {
            header: 'Category',
            accessor: 'name',
            className: 'text-sm',
            render: (row) => row.product?.category?.name
        },
        {
            header: 'Unit',
            accessor: 'unit_id',
            className: 'text-sm',
            render: (row) => row.product?.unit?.name
        },
        {
            header: 'Actions',
            accessor: 'action',
            align: 'center',
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <ProductEditSection props_data={row} />
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