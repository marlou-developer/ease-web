import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_warehouse_stock_thunk } from "@/app/redux/pos/pos-thunk";
import { edit_pos_warehouse_stocks_product_service } from "@/app/services/pos/pos-warehouse-service";
import store from "@/app/store/store";
import { Pencil, Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function EditStockSection({ props_data }) {
    const { categories, units } = useSelector(
        (store) => store.pos
    );
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
            subscriber_id: props_data?.subscriber_id || "",
            pos_product_id: props_data?.pos_product_id || "",
            pos_warehouse_id: props_data?.pos_warehouse_id || "",
            barcode: props_data?.product?.barcode || "",
            name: props_data?.product?.name || "",
            category_id: props_data?.product?.category_id || "",
            unit_id: props_data?.product?.unit_id || "",
            cost_price: props_data?.cost_price || "",
            stocks: props_data?.stocks || 0,
            image: "",
            selling_price: props_data?.selling_price || 0
        },
    });
    console.log('props_datassssssssss', props_data)
    const watchValues = watch()
    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            // Append all fields except image dynamically
            const { image, ...fields } = data;
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append image if exists
            if (image?.length) {
                formData.append("image", image[0]);
            }

            await edit_pos_warehouse_stocks_product_service(props_data?.id, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await store.dispatch(get_pos_warehouse_stock_thunk());
            await setOpen(false);
            await reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Product Created Successfully!",
                })
            );
            console.log("Product created successfully!");
        } catch (error) {
            setOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Product Created Unsuccessful!",
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
                    {/* Barcode */}
                    <div className="flex gap-3">
                        <Input
                            label="Barcode"
                            name="barcode"
                            disabled={watchValues.barcode}
                            {...register("barcode", {
                                required: false,
                            })}
                            error={errors.barcode}
                        />

                        {/* Name */}
                        <Input
                            label="Product Name"
                            name="name"
                            disabled
                            {...register("name", {
                                required: "Name is required",
                            })}
                            error={errors.name}
                        />
                    </div>

                    <div className="flex gap-3">
                        {/* Category */}
                        <Controller
                            name="category_id"
                            control={control}
                            rules={{ required: "Category is required" }}
                            render={({ field }) => (
                                <Select
                                    label="Select Category"
                                    disabled={watchValues.category_id}
                                    options={categories?.map(res => ({
                                        label: res.name,
                                        value: res.id
                                    }))}
                                    error={errors.category_id}
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
                                    label="Select Unit"
                                    disabled={watchValues.unit_id}
                                    options={units?.map(res => ({
                                        label: res.name,
                                        value: res.id
                                    }))}
                                    error={errors.unit_id}
                                    {...field} // passes value & onChange
                                />
                            )}
                        />
                    </div>
                    <div className="flex gap-3">
                        {/* Cost Price */}
                        <Input
                            label="Cost Price"
                            type="number"
                            step="0.01"
                            {...register("cost_price", {
                                required: "Cost price is required",
                            })}
                            name="cost_price"
                            error={errors.cost_price}
                        />

                        <Input
                            label="Selling Price"
                            type="number"
                            step="0.01"
                            {...register("selling_price", {
                                required: "Cost price is required",
                            })}
                            name="selling_price"
                            error={errors.selling_price}
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
                            error={errors.stocks}
                        />
                    </div>

                    {/* Image */}
                    {/* <div className="flex w-full">
                        <ImageUpload
                            label="Upload Image"
                            {...register("image", {
                                required: "Image is required",
                                validate: {
                                    lessThan5MB: (files) =>
                                        files[0]?.size < 5000000 ||
                                        "Max size 5MB",
                                    acceptedFormats: (files) =>
                                        ["image/jpeg", "image/png"].includes(
                                            files[0]?.type
                                        ) || "Only PNG/JPG allowed",
                                },
                            })}
                            error={errors.image}
                        />
                    </div> */}

                    {/* Actions */}
                    <div className="col-span-2 flex justify-end gap-2 mt-4">
                        <Button
                            type="submit"
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
