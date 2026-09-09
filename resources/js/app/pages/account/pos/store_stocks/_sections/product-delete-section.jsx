import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-thunk";
import { delete_pos_product_stocks_service } from "@/app/services/pos/pos-product-stock";
import store from "@/app/store/store";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function ProductDeleteSection({ props_data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await delete_pos_product_stocks_service(props_data?.id);
            await store.dispatch(get_pos_product_stocks_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Product moved to removed products!",
                }),
            );
            setIsModalOpen(false);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to remove product.",
                }),
            );
            console.error("Error removing product:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition"
            >
                <Trash2 size={14} /> Delete
            </button>
            <Modal
                title="Remove Product"
                width="max-w-md"
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
                    <h1 className="text-lg font-semibold">
                        Are you sure you want to remove{" "}
                        {props_data?.product?.name || "this product"}?
                    </h1>
                    <p className="text-sm text-slate-500">
                        This product will be moved to Removed Products and can
                        be restored anytime.
                    </p>
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
                            Remove Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
