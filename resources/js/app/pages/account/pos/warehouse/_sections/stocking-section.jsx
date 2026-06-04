import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-product-thunk";
import { get_pos_warehouse_stock_thunk } from "@/app/redux/pos/pos-thunk";
import { add_new_stock_in_store_service } from "@/app/services/pos/pos-warehouse-service";
import store from "@/app/store/store";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function StockingSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        values: {
            id: props_data.id,
            barcode: props_data?.product?.barcode || "",
            name: props_data?.product?.name || "",
            cost_price: props_data?.cost_price || "",
            sell_price: null,
            stocks: null,
            current_stock: props_data?.stocks || 0,
            image: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const { image, ...fields } = data;
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (image?.length) {
                formData.append("image", image[0]);
            }

            await add_new_stock_in_store_service(formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await store.dispatch(get_pos_warehouse_stock_thunk())
            setOpen(false);
            reset();

            dispatch(
                setAlert({
                    type: "success",
                    title: "Product Created Successfully!",
                })
            );
        } catch (error) {
            setOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Product Creation Unsuccessful!",
                })
            );
            console.error("Error creating product:", error);
        }
    };

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                variant="primary"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Stocking
                </div>
            </Button>

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Stock to Store</h3>

                    <div className="flex gap-3">
                        <Input
                            label="Barcode"
                            name="barcode"
                            disabled
                            {...register("barcode", { required: "Barcode is required" })}
                            error={errors?.barcode?.message}
                        />

                        <Input
                            disabled
                            label="Product Name"
                            name="name"
                            {...register("name", { required: "Name is required" })}
                            error={errors?.name?.message}
                        />
                        <Input
                            disabled
                            label="Current Stock"
                            name="current_stock"
                            {...register("current_stock", { required: "Current stock is required" })}
                            error={errors?.current_stock?.message}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Input
                            label="Cost Price"
                            disabled
                            type="number"
                            step="0.01"
                            {...register("cost_price", { required: "Cost price is required" })}
                            name="cost_price"
                            error={errors?.cost_price?.message}
                        />

                        {/* --- FIXED: Added custom cost price comparison validation --- */}
                        <Input
                            label="Sell Price"
                            type="number"
                            step="0.01"
                            {...register("sell_price", {
                                required: "Sell price is required",
                                validate: (value, formValues) => {
                                    const sell = parseFloat(value) || 0;
                                    const cost = parseFloat(formValues.cost_price) || 0;

                                    // Blocks submission if sell price is lower or equal to cost price
                                    return sell > cost || `Sell price must be greater than cost price ($${cost})`;
                                }
                            })}
                            name="sell_price"
                            error={errors?.sell_price?.message}
                        />

                        <Input
                            label="Transfer Quantity"
                            type="number"
                            step="0.01"
                            {...register("stocks", {
                                required: "Stocks is required",
                                validate: (value, formValues) => {
                                    const requestedAmount = parseFloat(value) || 0;
                                    const availableAmount = parseFloat(formValues.current_stock) || 0;
                                    return requestedAmount <= availableAmount || `Cannot exceed current stock (${availableAmount})`;
                                }
                            })}
                            name="stocks"
                            error={errors?.stocks?.message}
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
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
                            Save Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}