import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Pencil } from "lucide-react";
import { update_discount_per_item_service } from "@/app/services/pos/pos-sales-service";
import store from "@/app/store/store";
import { get_pos_sales_by_id_thunk } from "@/app/redux/pos/pos-thunk";

export default function DiscountPerItemSection({ data }) {
    const [open, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // State to hold the new discount value
    const [discountValue, setDiscountValue] = useState("");
    const dispatch = useDispatch();
console.log('datadata',data)
    // Reset the input to the current item's discount when the modal opens
    useEffect(() => {
        if (open) {
            setDiscountValue(data?.discount || "");
        }
    }, [open, data]);

    const handleEditDiscount = async () => {
        setIsUpdating(true);
        try {
            // Pass the item's ID and the new discount value to your service
            await update_discount_per_item_service({
                id:data.id,
                discount: Number(discountValue)
            });
            
            const saleId = window.location.pathname.split('/')[4];
            await store.dispatch(get_pos_sales_by_id_thunk(saleId));
            
            dispatch(setAlert({ type: "success", message: "Discount updated successfully" }));
            setOpen(false);
        } catch (error) {
            dispatch(setAlert({ type: "error", message: "Failed to update discount" }));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="primary"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Pencil size={18} /> 
                </div>
            </Button>

            <Modal
                title="Update Item Discount"
                width="max-w-md"
                isOpen={open}
                onClose={() => !isUpdating && setOpen(false)}
            >
                <div className="flex flex-col mt-2 gap-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Updating discount for: <span className="font-semibold">{data?.pos_product_stock?.product?.name || "Item"}</span>
                    </p>

                    <Input 
                        label="Discount per item"
                        type="number"
                        placeholder="0.00"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                    />

                    <div className="flex justify-end items-center gap-3 mt-8">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="primary" // Changed to primary for an update action
                            onClick={handleEditDiscount}
                            loading={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update Discount"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}