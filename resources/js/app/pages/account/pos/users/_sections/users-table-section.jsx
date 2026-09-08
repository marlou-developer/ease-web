import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import { header } from "framer-motion/client";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLogsSection from "./user-logs-section";
import LockProfileSection from "./lock-profile-section";
import EditUserSection from "./edit-user-section";
import DeleteUserSection from "./delete-user-section";
// import StockingSection from "..."; // Make sure to import this if you use it!

// Admin=1, Inventory=2, Cashier=3, Encoder=4
const USER_TYPE_STYLES = {
    Admin: "bg-blue-100 text-blue-700",
    Inventory: "bg-amber-100 text-amber-700",
    Cashier: "bg-green-100 text-green-700",
    Encoder: "bg-purple-100 text-purple-700",
    // Shopee: "bg-orange-100 text-orange-700"
};

export default function UsersTableSection() {
    const { searchTerm, category, currentPage, users } = useSelector(
        (store) => store.pos,
    );
    const dispatch = useDispatch();

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredProducts = users?.filter((p) => {
        const matchesSearch = p?.name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase());
        const matchesCat =
            category === "All Categories" || p.category_id === category;
        return matchesSearch && matchesCat;
    });

    const currentItems = filteredProducts?.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    // Define exactly how each column should look and behave
    const columns = [
        {
            header: "Users",
            accessor: "name",
            className: "font-bold text-gray-700",
        },
        {
            header: "Assigned Branch",
            accessor: "branch",
            className: "font-bold text-gray-700",
            render: (row) => row?.store?.name || "-",
        },
        {
            header: "Email",
            accessor: "email",
            className: "font-bold text-gray-700",
        },
        {
            header: "User Type",
            accessor: "pos_user_type",
            className: "font-bold text-gray-700",
            render: (row) => (
                <span
                    className={`px-3 py-1 rounded text-[11px] font-bold inline-block uppercase text-center ${
                        USER_TYPE_STYLES[row?.pos_user_type] ||
                        "bg-gray-100 text-gray-700"
                    }`}
                >
                    {row?.pos_user_type || "-"}
                </span>
            ),
        },
        {
            header: "Position",
            accessor: "position",
            className: "font-bold text-gray-700",
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "font-bold text-gray-700",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <EditUserSection user={row} />
                    <DeleteUserSection user={row} />
                    <LockProfileSection user={row} />
                    <UserLogsSection userId={row?.id} />
                </div>
            ),
        },
    ];

    return (
        <>
            <Table columns={columns} data={currentItems} />
        </>
    );
}
