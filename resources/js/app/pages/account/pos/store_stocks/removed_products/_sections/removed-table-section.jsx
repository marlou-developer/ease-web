import Table from "@/app/_components/table";
import Badge from "@/app/_components/badge";
import peso_value from "@/app/lib/peso-value";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import ProductRestoreSection from "./product-restore-section";

export default function RemovedTableSection() {
    const { removed_stocks } = useSelector((store) => store.pos);

    const columns = [
        {
            header: "ID",
            accessor: "id",
            className: "font-bold text-slate-800",
            render: (row) => row?.id,
        },
        {
            header: "Image",
            accessor: "image",
            render: (row) => (
                <img
                    src={row.product?.image ?? "/images/product_null.webp"}
                    alt={row.product?.name}
                    className="w-10 h-10 object-contain drop-shadow-sm"
                />
            ),
        },
        {
            header: "Product",
            accessor: "product_name",
            className: "font-bold text-slate-800",
            render: (row) => row.product?.name,
        },
        {
            header: "Category",
            accessor: "category",
            className: "text-sm",
            render: (row) => row.product?.category?.name,
        },
        {
            header: "Branch",
            accessor: "pos_store",
            className: "text-sm",
            render: (row) => row?.pos_store?.name,
        },
        {
            header: "Stocks",
            accessor: "stocks",
            className: "text-sm",
            render: (row) => (
                <Badge
                    outlined
                    label={row?.stocks > 0 ? `${row.stocks} pcs` : "Out of Stock"}
                    variant={row?.stocks > 0 ? "success" : "danger"}
                />
            ),
        },
        {
            header: "Price",
            accessor: "selling_price",
            className: "font-semibold text-slate-900",
            render: (row) => peso_value(row?.selling_price ?? 0),
        },
        {
            header: "Removed On",
            accessor: "deleted_at",
            className: "text-sm",
            render: (row) =>
                row?.deleted_at ? moment(row.deleted_at).format("LL") : "-",
        },
        {
            header: "Actions",
            accessor: "action",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <ProductRestoreSection props_data={row} />
                </div>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} data={removed_stocks} />
        </>
    );
}
