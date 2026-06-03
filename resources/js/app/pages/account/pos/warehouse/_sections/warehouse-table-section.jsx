import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";

const WarehouseTableSection = () => {
    const { products } = useSelector((store) => store.pos);

    // Merged and unified status styles
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

    const columns = [
        {
            header: 'REFERENCE #',
            accessor: 'id'
        },
        {
            header: 'Products',
            accessor: 'product',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Stocks',
            accessor: 'stocks',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Action',
            accessor: 'action',
            className: 'font-bold text-gray-700'
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

    console.log('products', products)
    return (
        <div className="font-sans">
            <Table columns={columns} data={products.map(res => ({
                ...res,
                product: res.product.name,

            }))} />
        </div>
    );
};


export default WarehouseTableSection;