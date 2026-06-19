import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { create_pos_category_service } from "@/app/services/pos/pos-categories-service";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function CreateCategorySection() {
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
            name: "",
        },  
    });

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            await create_pos_category_service(formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            await store.dispatch(get_pos_product_stocks_thunk());
            await setOpen(false);
            await reset();
            dispatch(
                setAlert({  
                    type: "success",
                    title: "Category Created Successfully!",
                }),
            );
            console.log("Category created successfully!");
        } catch (error) {
            setOpen(false);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Category Created Unsuccessful!",
                }),
            );
            console.error("Error creating category:", error);
        }
    };

    return (
        <div>
            <Button
                onClick={() => {
                    setOpen(true);
                    reset();
                }}
                className="text-white  border-white shadow-sm  hover:bg-blue-500"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} />
                    New Category
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
                    <div className="mt-3">
                        {/* Name */}
                        <Input
                            label="Category Name"
                            name="name"
                            {...register("name", {
                                required: "Category name is required",
                            })}
                            error={errors.name}
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
                            Save Category
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
