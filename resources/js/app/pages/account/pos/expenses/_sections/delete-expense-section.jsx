import React, { useState } from "react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { Trash2 } from "lucide-react";
import { delete_pos_expense_service } from "@/app/services/pos/pos-expense-service";
import store from "@/app/store/store";
import { get_pos_expenses_thunk } from "@/app/redux/pos/pos-thunk";
import { setAlert } from "@/app/redux/app-slice";
import { useDispatch } from "react-redux";

export default function DeleteExpenseSection({ row }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleDelete = async (expense) => {
        setLoading(true);
        try {
            await delete_pos_expense_service(expense.id);
            await store.dispatch(get_pos_expenses_thunk());
            setIsModalOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Expense deleted successfully!",
                }),
            );
        } catch (error) {
            console.error("Error deleting expense:", error);
            setIsModalOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Expense deletion unsuccessful!",
                }),
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600"
            >
                <Trash2 size={14} /> Delete
            </button>

            <Modal
                title="Delete Expense"
                width="max-w-2xl"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete(row);
                    }}
                    className="flex flex-col gap-4"
                >
                    <h1 className="text-lg font-semibold">
                        Are you sure you want to delete this expense?
                    </h1>
                    <hr className="my-2" />
                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="danger"
                            outlined
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Delete Expense
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
