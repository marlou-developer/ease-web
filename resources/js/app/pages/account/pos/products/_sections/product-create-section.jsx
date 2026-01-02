import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ProductCreateSection() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
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

    const onSubmit = (data) => {
        console.log(data);
        // TODO: send to backend (axios / fetch)
        // reset();
        // setOpen(false);
    };

    return (
        <>
            <button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                className="bg-blue-500 hover:bg-blue-400 transition flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-400 shadow-sm"
            >
                <Plus size={18} /> Add Product
            </button>

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
                                    { value: "hello", label: "Hello" },
                                    { value: "world", label: "World" },
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
                                label="Select Category"
                                options={[
                                    { value: "hello", label: "Hello" },
                                    { value: "world", label: "World" },
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
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 border rounded text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save Product
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
