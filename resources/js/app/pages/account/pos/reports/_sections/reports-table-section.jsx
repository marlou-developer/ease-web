import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function ReportsTableSection() {
    const { reports } = useSelector(
        (store) => store.pos
    );

    const currentItems = reports?.data ?? [];
    console.log('currentItems', reports?.data)
    const columns = [
        {
            header: 'Invoice No.',
            accessor: 'id',
            render: (row) => {
                return row?.sale?.invoice_no;
            }
        },
        {
            header: 'Product Stock ID',
            accessor: 'code',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row?.pos_product_stock_id;
            }
        },
        {
            header: 'Products',
            accessor: 'product',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row?.pos_product_stock?.product?.name;
            }
        },
        {
            header: 'Quantity',
            accessor: 'quantity',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row?.quantity;
            }
        },
        {
            header: 'Cost Price',
            accessor: 'cost_price',
            className: 'font-bold text-gray-700',
            render: (row) => {
                // Good practice to ensure these are treated as numbers
                return (Number(row?.cost_price) * Number(row?.quantity)).toFixed(2);
            }
        },
        {
            header: 'Total',
            accessor: 'total',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Margin',
            accessor: 'margin',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const sales = Number(row?.total || 0);
                const profit = Number(row?.profit || 0);

                const margin = sales > 0
                    ? ((profit / sales) * 100).toFixed(2)
                    : "0.00";

                return `${margin}%`;
            }
        },
        // {
        //     header: 'Action',
        //     accessor: 'action',
        //     align: 'center',
        //     className: 'font-bold text-gray-700',
        //     render: (row) => {
        //         return <div className="flex gap-3"></div>;
        //     }
        // },
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