import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "./stocking-section";
// import EditStockSection from "./edit-stock-warehouse";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function RequestsTableSection() {
    const { searchTerm, category, currentPage, product_requests } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    console.log('requests', product_requests)

    const filteredRequests = product_requests?.data?.filter((p) => {
        const term = searchTerm.toLowerCase();
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

    const currentItems = filteredRequests?.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const columns = [
        {
            header: 'Request ID',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.id
        },

        {
            header: 'Requested By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.barcode
        },
        {
            header: 'Received By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.barcode
        },
        {
            header: 'Processed By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.barcode
        },
        {
            header: 'Quantity',
            accessor: 'quantity',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Action',
            accessor: 'action',
            align: 'center',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return <div className="flex gap-3">
                    {/* <EditStockSection props_data={row} /> */}
                    {/* <StockingSection props_data={row} /> */}
                </div>
            }
        },

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