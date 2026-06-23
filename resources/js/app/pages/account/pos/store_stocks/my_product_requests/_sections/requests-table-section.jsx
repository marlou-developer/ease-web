import Badge from "@/app/_components/badge";
import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import StockingSection from "./stocking-section";
// import EditStockSection from "./edit-stock-warehouse";
// import StockingSection from "..."; // Make sure to import this if you use it!

export default function RequestsTableSection() {
    const { product_requests } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();

    const columns = [
        {
            header: 'Request ID',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.id
        },
        {
            header: 'Name of Store',
            accessor: 'id',
            className: 'font-bold text-slate-800',
            render: (row) => row?.pos_store?.name
        },
        {
            header: 'Requested By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row.requestor?.name
            }
        },

        {
            header: 'Processed By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row.processor?.name
            }
        },
        {
            header: 'Received By',
            accessor: 'barcode',
            className: 'font-bold text-gray-700',
            render: (row) => {
                return row.receiver?.name
            }
        },
        {
            header: 'Quantity',
            accessor: 'quantity',
            className: 'font-bold text-gray-700'
        },
        {
            header: 'Status',
            accessor: 'status',
            className: 'font-bold text-gray-700',
            render: (row) => {
                const status = row?.status;

                // Map the status string to the corresponding Badge variant
                const getBadgeVariant = (statusString) => {
                    switch (statusString) {
                        case 'Pending':
                            return 'warning'; // Yellow
                        case 'Processing':
                            return 'primary'; // Blue
                        case 'Received':
                            return 'success'; // Green
                        case 'Cancelled':
                            return 'danger'; // Red
                        case 'Returned':
                            return 'secondary'; // Gray
                        default:
                            return 'secondary'; // Fallback
                    }
                };
                return (
                    <div className="flex gap-3">
                        <Badge
                            outlined
                            label={status || 'Unknown'}
                            variant={getBadgeVariant(status)}
                        />
                    </div>
                );
            }
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
                data={product_requests?.data ?? []}
            />
        </>
    );
}