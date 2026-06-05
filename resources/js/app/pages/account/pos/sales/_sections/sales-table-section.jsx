import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "./stocking-section";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function SalesTableSection() {
    const { searchTerm, category, currentPage, sales } = useSelector(
        (store) => store.pos
    );;
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    console.log('sales', sales)

    const filteredProducts = sales?.filter((p) => {
        const matchesSearch = p?.invoice_no
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
            header: 'INVOICE #',
            accessor: 'invoice_no'
        },
        {
            header: 'Products',
            accessor: 'product_name',
            className: 'font-bold text-gray-700',
            render: (row) => row.product?.name
        },
        {
            header: 'Total Cost Price',
            accessor: 'cost_price',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const total_cost_price = row?.sale_items?.reduce((accumulator, currentItem) => {
                    return (accumulator + Number(currentItem.cost_price)) * currentItem.quantity;
                }, 0);
                return peso_value(total_cost_price);
            }
        },
        {
            header: 'Total Selling Price',
            accessor: 'selling_price',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const total_selling_price = row?.sale_items?.reduce((accumulator, currentItem) => {
                    return (accumulator + Number(currentItem.selling_price)) * currentItem.quantity;
                }, 0);
                return peso_value(total_selling_price);
            }
        },
        {
            header: 'Total Discount',
            accessor: 'total_discount',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const total_total_discount = row?.sale_items?.reduce((accumulator, currentItem) => {
                    return (accumulator + Number(currentItem.discount));
                }, 0);
                return peso_value(total_total_discount);
            }
        },
        {
            header: 'Total Discounted Price',
            accessor: 'total',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const total_discounted_price = row?.sale_items?.reduce((accumulator, currentItem) => {
                    return (accumulator + Number(currentItem.discounted_price));
                }, 0);
                return peso_value(total_discounted_price);
            }
        },
        {
            header: 'Total Profit',
            accessor: 'profit',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const total_profit = row?.sale_items?.reduce((accumulator, currentItem) => {
                    return (accumulator + Number(currentItem.profit));
                }, 0);
                return peso_value(total_profit);
            }
        },
        {
            header: 'Total Item',
            accessor: 'total_item',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row?.sale_items?.length;
            }
        },

        {
            header: 'Action',
            accessor: 'action',
            align: 'center',
            className: 'font-bold text-gray-700',
            // render: (row) => {
            //     return <><StockingSection props_data={row} /></>
            // }
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
            <Table
                columns={columns}
                data={currentItems}
            />
        </>
    );
}