import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-product-thunk";
import { create_pos_product_stocks_product_service } from "@/app/services/pos/pos-product-service";
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
        // 1. FIXED: Changed 'defaultValues' to 'values' to make it fully reactive to props_data updates
        values: {
            barcode: props_data?.product?.barcode || "",
            name: props_data?.product?.name || "", // Falls back to your default string if props_data is empty
            category_id: props_data?.category_id || "",
            unit_id: props_data?.unit_id || "",
            cost_price: props_data?.cost_price || "",
            sell_price: props_data?.sell_price || "",
            stocks: props_data?.stocks || "",
            image: "",
        },
    });

    console.log('props_data',props_data)
    
    // 2. FIXED: Completely removed the bug-prone useEffect hook that was overwriting form fields

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

            await create_pos_product_stocks_product_service(formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await store.dispatch(get_pos_product_stocks_thunk());
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
                    reset(); // Clears any modified user inputs back to the reactive values template
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Stock Item</h3>

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
                    </div>

                    <div className="flex gap-3">
                        <Controller
                            name="category_id"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select
                                disabled
                                    label="Select Category"
                                    options={props_data?.categories?.map(cat => ({
                                        value: cat.id,
                                        label: cat.name
                                    })) || []}
                                    error={errors?.category_id?.message}
                                    {...field}
                                />
                            )}
                        />

                        <Controller
                            name="unit_id"
                            control={control}
                            rules={{ required: "Unit is required" }}
                            render={({ field }) => (
                                <Select
                                disabled
                                    label="Select Unit"
                                    options={props_data?.units?.map(unit => ({
                                        value: unit.id,
                                        label: unit.name
                                    })) || []}
                                    error={errors?.unit_id?.message}
                                    {...field}
                                />
                            )}
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

                        <Input
                            label="Sell Price"
                            type="number"
                            step="0.01"
                            {...register("sell_price", { required: "Sell price is required" })}
                            name="sell_price"
                            error={errors?.sell_price?.message}
                        />

                        <Input
                            label="Stocks"
                            type="number"
                            step="0.01"
                            disabled
                            {...register("stocks", { required: "Stocks is required" })}
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