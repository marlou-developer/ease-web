import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import { create_pos_product_service } from "@/app/services/pos-product-service";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function ProductCreateSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            barcode: "",
            name: "",
            category_id: "",
            unit_id: "",
            cost_price: "",
            sell_price: "",
            image: "",
        },
    });

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

            await create_pos_product_service(formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
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
            dispatch(
                setAlert({
                    type: "error",
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
                className="text-white  border-white shadow-sm  hover:bg-blue-500"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Add Product
                </div>
            </Button>
            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* Barcode */}
                    <Input
                        label="Barcode"
                        name="barcode"
                        {...register("barcode", {
                            required: "Barcode is required",
                        })}
                        error={errors.barcode}
                    />

                    {/* Name */}
                    <Input
                        label="Product Name"
                        name="name"
                        {...register("name", { required: "Name is required" })}
                        error={errors.name}
                    />

                    {/* Category */}
                    <Controller
                        name="category_id"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({ field }) => (
                            <Select
                                label="Select Category"
                                options={[
                                    { value: 1, label: "Hello" },
                                    { value: 2, label: "World" },
                                ]}
                                error={errors.category_id}
                                {...field} // passes value & onChange
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
                                options={[
                                    { value: 1, label: "Hello" },
                                    { value: 2, label: "World" },
                                ]}
                                error={errors.unit_id}
                                {...field} // passes value & onChange
                            />
                        )}
                    />

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

                    {/* Sell Price */}
                    <Input
                        label="Sell Price"
                        type="number"
                        step="0.01"
                        {...register("sell_price", {
                            required: "Sell price is required",
                        })}
                        name="sell_price"
                        error={errors.sell_price}
                    />

                    {/* Image */}
                    <div className="flex w-full">
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
                    </div>

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
