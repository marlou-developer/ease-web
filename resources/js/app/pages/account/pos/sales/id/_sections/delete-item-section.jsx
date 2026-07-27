import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Trash } from "lucide-react";
import { delete_pos_sales_item_service } from "@/app/services/pos/pos-sales-service";
import store from "@/app/store/store";
import { get_pos_sales_by_id_thunk } from "@/app/redux/pos/pos-thunk";

// Passed 'item' as a prop so this component is reusable for any item
export default function DeleteItemSection({ data }) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await delete_pos_sales_item_service(data)
            await store.dispatch(get_pos_sales_by_id_thunk(window.location.pathname.split('/')[4]))
            dispatch(setAlert({ type: "success", message: "Item deleted successfully" }));
            setOpen(false);
        } catch (error) {
            dispatch(setAlert({ type: "error", message: "Failed to delete item" }));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                // Changed the hover color to red to indicate a destructive action
                variant="danger"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Trash size={18} /> Delete Item
                </div>
            </Button>

            <Modal
                title="Confirm Deletion"
                width="max-w-md" // Reduced width to fit a simple confirmation message
                isOpen={open}
                onClose={() => !isDeleting && setOpen(false)}
            >
                <div className="flex flex-col mt-2">
                    <p className="text-gray-700">
                        Are you sure you want to remove <strong className="text-gray-900">{data?.name}</strong>?
                        This action cannot be undone.
                    </p>

                    <div className="flex justify-end items-center gap-3 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleDelete}
                            loading={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}