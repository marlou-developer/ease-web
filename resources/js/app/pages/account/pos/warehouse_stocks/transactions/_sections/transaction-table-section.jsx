import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TransactionTableSection() {
    const { pos_warehouse_transactions } = useSelector(
        (store) => store.pos,
    );

    const columns = [
        {
            header: "Transaction ID",
            accessor: "name",
            className: "font-bold text-gray-700",
            render: (row) => {
                return row.transaction_id
            },
        },
        {
            header: "Transact By",
            accessor: "name",
            className: "font-bold text-gray-700",
            render: (row) => {
                return row?.transact_by?.name
            },
        },

        {
            header: "Transfer From",
            accessor: "name",
            className: "font-bold text-gray-700",
            render: (row) => {
                return row.transfer_from
            },
        },
        {
            header: "Product",
            accessor: "product",
            className: "font-bold text-gray-700",
            render: (row) => {
                console.log('row?.pos_product_stock?.product',row?.pos_product_stock)
                return row?.pos_product_stock?.product?.name
            },
        },
        {
            header: "Quantity",
            accessor: "stocks",
            className: "font-bold text-gray-700",
        },
        {
            header: "Transfer To",
            accessor: "name",
            className: "font-bold text-gray-700",
            render: (row) => {
                return row.transfer_to
            },
        },
        {
            header: "Status",
            accessor: "status",
            className: "font-bold text-gray-700",
        },
        // {
        //     header: "Stocks",
        //     accessor: "stocks",
        //     className: "font-bold text-gray-700",
        // },
    ];

    return (
        <>
            <Table
                columns={columns}
                data={pos_warehouse_transactions?.data}
            />
        </>
    );
}
