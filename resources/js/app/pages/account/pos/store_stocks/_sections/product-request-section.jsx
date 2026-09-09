import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-thunk";
import { create_pos_store_requests_service } from "@/app/services/pos/pos-store-requests-service";
import store from "@/app/store/store";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function ProductRequestSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { products } = useSelector((store) => store.pos);

    // The matching warehouse stock for this store product, used as the request target
    const warehouse_stock = products?.find(
        (p) => p.pos_product_id === props_data?.pos_product_id,
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            quantity: "",
        },
    });

    const onSubmit = async (form_data) => {
        try {
            await create_pos_store_requests_service({
                requests: [
                    {
                        pos_warehouse_stock_id: warehouse_stock?.id,
                        quantity: form_data.quantity,
                    },
                ],
            });
            await store.dispatch(get_pos_product_stocks_thunk());

            setOpen(false);
            reset({ quantity: "" });

            dispatch(
                setAlert({
                    type: "success",
                    title: "Request sent to warehouse successfully!",
                }),
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to send request to warehouse!",
                }),
            );
            console.error("Error requesting stock from warehouse:", error);
        }
    };

    const handleOpen = () => {
        reset({ quantity: "" });
        setOpen(true);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                disabled={!warehouse_stock}
                title={!warehouse_stock ? "No warehouse stock available for this product" : undefined}
                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
            >
                <PlusIcon size={14} />
                Request
            </button>
            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <div className="grid grid-cols-2 gap-2 animate-fade-in my-5">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                Product Name
                            </p>
                            <p className="text-gray-800 font-medium">
                                {props_data.product?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                Barcode
                            </p>
                            <p className="text-gray-800 font-medium">
                                {props_data.product?.barcode}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                Category
                            </p>
                            <p className="text-gray-800 font-medium">
                                {props_data?.product?.category?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                Unit
                            </p>
                            <p className="text-gray-800 font-medium">
                                {props_data?.product?.unit?.name}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {/* Cost Price */}
                        <Input
                            label="Cost Price"
                            type="number"
                            disabled
                            step="0.01"
                            value={warehouse_stock?.cost_price ?? 0}
                            onChange={() => {}}
                        />

                        {/* Available Warehouse Stocks */}
                        <Input
                            label="Warehouse Stocks"
                            type="number"
                            step="0.01"
                            disabled
                            value={warehouse_stock?.stocks ?? 0}
                            onChange={() => {}}
                        />

                        <Input
                            label="Quantity to Request"
                            type="number"
                            step="0.01"
                            {...register("quantity", {
                                required: "Quantity is required",
                                validate: (value) => {
                                    if (parseFloat(value) <= 0) {
                                        return "Quantity must be greater than 0";
                                    }
                                    if (
                                        parseFloat(value) >
                                        parseFloat(warehouse_stock?.stocks ?? 0)
                                    ) {
                                        return `Exceeds available warehouse stock (${warehouse_stock?.stocks ?? 0})`;
                                    }
                                    return true;
                                },
                            })}
                            name="quantity"
                            error={errors.quantity?.message}
                        />
                    </div>

                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                        <Button
                            type="button" // Fixed to prevent form submission
                            variant="danger"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                        >
                            Send Request
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
