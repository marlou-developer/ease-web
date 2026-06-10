import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_product_stocks_thunk, get_pos_warehouse_stock_thunk } from "@/app/redux/pos/pos-thunk";
import { edit_pos_category_service } from "@/app/services/pos/pos-categories-service";
import { edit_pos_product_stocks_product_service } from "@/app/services/pos/pos-product-service";
import { edit_pos_warehouse_stocks_product_service } from "@/app/services/pos/pos-warehouse-service";
import store from "@/app/store/store";
import { Pencil, Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function ProductEditSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            id: props_data?.id,
            cost_price: props_data?.cost_price || "",
            stocks: props_data?.stocks || 0,
            selling_price: props_data?.selling_price || 0
        },
    });

    const watchValues = watch();

    const onSubmit = async (form_data) => {
        try {
            await edit_pos_product_stocks_product_service(form_data);
            await store.dispatch(get_pos_product_stocks_thunk());

            setOpen(false);

            dispatch(
                setAlert({
                    type: "success",
                    title: "Product Updated Successfully!",
                })
            );
        } catch (error) {
            setOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Product Update Unsuccessful!",
                })
            );
            console.error("Error updating product:", error);
        }
    };

    const handleOpen = () => {
        // Pre-fill the form with the specific row's data when opening
        reset({
            id: props_data?.id,
            cost_price: props_data?.cost_price || "",
            stocks: props_data?.stocks || 0,
            selling_price: props_data?.selling_price || 0
        });
        setOpen(true);
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="purple"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Pencil size={18} />Edit
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
                    <div className="grid grid-cols-2 gap-2 animate-fade-in my-5">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Product Name</p>
                            <p className="text-gray-800 font-medium">{props_data.product?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Barcode</p>
                            <p className="text-gray-800 font-medium">{props_data.product?.barcode}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Category</p>
                            <p className="text-gray-800 font-medium">
                                {props_data?.product?.category?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Unit</p>
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
                            step="0.01"
                            {...register("cost_price", {
                                required: "Cost price is required",
                                validate: (value, formValues) =>
                                    parseFloat(value) <= parseFloat(formValues.selling_price) || "Cost price cannot be higher than selling price"
                            })}
                            name="cost_price"
                            error={errors.cost_price?.message}
                        />

                        {/* Selling Price */}
                        <Input
                            label="Selling Price"
                            type="number"
                            step="0.01"
                            {...register("selling_price", {
                                required: "Selling price is required",
                                validate: (value, formValues) =>
                                    parseFloat(value) >= parseFloat(formValues.cost_price) || "Selling price cannot be lower than cost price"
                            })}
                            name="selling_price"
                            error={errors.selling_price?.message}
                        />

                        {/* Stocks */}
                        <Input
                            label="Stocks"
                            type="number"
                            step="0.01"
                            {...register("stocks", {
                                required: "Stocks is required",
                            })}
                            name="stocks"
                            error={errors.stocks?.message}
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
                            Save Product
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}