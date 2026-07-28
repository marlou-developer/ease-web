import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import React from "react";
import { useSelector } from "react-redux";
import DeleteItemSection from "./delete-item-section";
import DiscountPerItemSection from "./discount-per-item-section";

export default function SalesTableSection() {
    const { sale } = useSelector((store) => store.pos);

    // The current items are the line items (sale_items) for the selected sale
    const currentItems = sale?.sale_items;

    const columns = [
        {
            header: 'Product Name',
            accessor: 'product_name',
            className: 'font-bold text-gray-700',
            // Navigates through the nested JSON structure shown in image_bcfa43.png
            render: (row) => row?.pos_product_stock?.product?.name || 'N/A'
        },
        {
            header: 'Quantity',
            accessor: 'quantity',
            className: 'font-bold text-gray-700',
            render: (row) => row?.quantity || 1
        },
        {
            header: 'Fixed Price',
            accessor: 'fixed_price',
            className: 'font-bold text-gray-700',
            // Falls back to discounted_price if selling_price is not explicitly on the row
            render: (row) => peso_value(row?.selling_price || row?.discounted_price)
        },
        {
            header: 'Cost Price',
            accessor: 'cost_price',
            className: 'font-bold text-gray-700',
            render: (row) => peso_value(row?.cost_price)
        },
        {
            header: 'Discount',
            accessor: 'discount',
            className: 'font-bold text-gray-700',
            render: (row) => peso_value(row?.discount)
        },
        {
            header: 'Amount',
            accessor: 'amount',
            className: 'font-bold text-gray-700',
            // Uses discounted_price as the final amount line item based on the JSON structure
            render: (row) => peso_value(row?.discounted_price)
        },
        {
            header: 'Action',
            accessor: 'action',
            className: 'font-bold text-gray-700',
            // Uses discounted_price as the final action line item based on the JSON structure
            render: (row) => {
                return <div className="flex gap-2">
                    <DeleteItemSection data={row} />
                    <DiscountPerItemSection  data={row}/>
                </div>
            }
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