import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Table from "@/app/_components/table";
import { get_user_login_logs_service } from "@/app/services/app-service";
import { Logs } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";

const columns = [
    {
        header: "Date & Time",
        accessor: "login_at",
        render: (row) => (row?.login_at ? moment(row.login_at).format("LLL") : "-"),
    },
    {
        header: "Branch",
        accessor: "store",
        render: (row) => row?.store?.name || "-",
    },
    {
        header: "Logout",
        accessor: "logout_at",
        render: (row) => (row?.logout_at ? moment(row.logout_at).format("LLL") : "Active"),
    },
];

export default function UserLogsSection({ userId }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [error, setError] = useState("");

    const fetchLogs = async (page = 1) => {
        try {
            setLoading(true);
            setError("");
            const response = await get_user_login_logs_service(userId, page);
            setLogs(response?.data?.data || []);
            setPagination(response?.data);
        } catch (error) {
            setError(error?.response?.data?.message || "Failed to load login logs.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchLogs(1);
    };

    return (
        <div>
            <button title="Login logs" type="button" onClick={handleOpen} className="text-gray-500 hover:text-gray-700">
                <Logs size={16} />
            </button>

            <Modal title="Login Logs" width="max-w-2xl" isOpen={open} onClose={() => setOpen(false)}>
                {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

                {loading ? (
                    <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
                ) : (
                    <>
                        <Table columns={columns} data={logs} />
                        {pagination?.last_page > 1 && (
                            <div className="flex items-center justify-end gap-3 mt-4">
                                <Button
                                    type="button"
                                    variant="white"
                                    disabled={pagination.current_page <= 1}
                                    onClick={() => fetchLogs(pagination.current_page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-500">
                                    Page {pagination.current_page} of {pagination.last_page}
                                </span>
                                <Button
                                    type="button"
                                    variant="white"
                                    disabled={pagination.current_page >= pagination.last_page}
                                    onClick={() => fetchLogs(pagination.current_page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Modal>
        </div>
    );
}
