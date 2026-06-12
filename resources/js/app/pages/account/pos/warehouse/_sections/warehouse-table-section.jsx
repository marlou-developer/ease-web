import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import StockingSection from "./stocking-section";
import EditStockSection from "./edit-stock-warehouse";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function WarehouseTableSection() {
    const { searchTerm, category, currentPage, products } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredProducts = products?.pos_warehouse?.pos_warehouse_stocks?.filter((p) => {
        const matchesSearch = p?.product?.name
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts?.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const columns = [
        {
            header: 'REFERENCE #',
            accessor: 'id'
        },

        {
            header: 'Barcode',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.barcode
        },
        {
            header: 'Products',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.name
        },
        {
            header: 'Stocks',
            accessor: 'stocks',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Cost Price',
            accessor: 'cost_price',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Selling Price',
            accessor: 'selling_price',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Action',
            accessor: 'action',
            align: 'center',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return <div className="flex gap-3">
                    <EditStockSection props_data={row} />
                    <StockingSection props_data={row} />
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