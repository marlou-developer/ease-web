import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { get_removed_pos_product_stocks_thunk } from "@/app/redux/pos/pos-thunk";
import { restore_pos_product_stocks_service } from "@/app/services/pos/pos-product-stock";
import store from "@/app/store/store";
import { RotateCcw } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductRestoreSection({ props_data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleRestore = async () => {
        setLoading(true);
        try {
            await restore_pos_product_stocks_service(props_data?.id);
            await store.dispatch(get_removed_pos_product_stocks_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Product restored successfully!",
                }),
            );
            setIsModalOpen(false);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to restore product.",
                }),
            );
            console.error("Error restoring product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded text-xs font-bold hover:bg-green-600 transition"
            >
                <RotateCcw size={14} /> Restore
            </button>
            <Modal
                title="Restore Product"
                width="max-w-md"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRestore();
                    }}
                    className="flex flex-col gap-4"
                >
                    <h1 className="text-lg font-semibold">
                        Restore {props_data?.product?.name || "this product"}{" "}
                        back to your active products?
                    </h1>
                    <hr className="my-2" />
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
                            Restore Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
