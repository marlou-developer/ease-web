import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_purchases_thunk } from "@/app/redux/pos/pos-thunk";
import { delete_pos_purchases_service } from "@/app/services/pos/pos-purchases-service";
import store from "@/app/store/store";

export default function DeletePurchasesSection({ props_data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await delete_pos_purchases_service(props_data?.id);
            await store.dispatch(get_pos_purchases_thunk());
            setIsModalOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Purchase deleted successfully!",
                }),
            );
        } catch (error) {
            console.error("Error deleting purchase:", error);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Purchase deletion unsuccessful!",
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                <Trash2 size={14} /> Delete
            </button>

            <Modal
                title="Delete Purchase"
                width="max-w-2xl"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete();
                    }}
                    className="flex flex-col gap-4"
                >
                    <p>
                        Are you sure you want to delete purchase{" "}
                        {props_data?.reference_no || "this purchase"}?
                    </p>
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
                            <Trash2 size={14} /> Delete
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
