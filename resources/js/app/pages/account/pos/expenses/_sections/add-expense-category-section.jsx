import React, { useEffect, useState } from "react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { Plus, Edit2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_expense_categories_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import {
    add_pos_expense_category_service,
    update_pos_expense_category_service,
} from "@/app/services/pos/pos-expense-category-service";

export default function AddExpenseCategorySection({ category = null }) {
    const isEdit = Boolean(category);
    const [open, setOpen] = useState(false);
    const { expense_categories } = useSelector((store) => store.pos);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                name: category?.name ?? "",
            });
        }
    }, [open, category]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await update_pos_expense_category_service(category.id, data);
            } else {
                await add_pos_expense_category_service(data);
            }
            await store.dispatch(get_pos_expense_categories_thunk());
            setOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: `Expense category ${isEdit ? "updated" : "created"} successfully!`,
                }),
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: `Expense category ${isEdit ? "update" : "creation"} unsuccessful!`,
                }),
            );
            console.error("Error saving expense category:", error);
        }
    };

    return (
        <div>
            {isEdit ? (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
                >
                    <Edit2 size={14} /> Edit
                </button>
            ) : (
                <Button
                    onClick={() => setOpen(true)}
                    variant="primary"
                    outlined
                >
                    <div className="flex gap-2 items-center justify-center">
                        <Plus size={18} /> Add Expense Category
                    </div>
                </Button>
            )}

            <Modal
                title={
                    isEdit ? "Edit Expense Category" : "Add Expense Category"
                }
                width="max-w-lg"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Input
                        label="Category Name"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        error={errors.name}
                        required
                    />

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            List of Categories
                        </p>
                        <div className="border border-slate-200 rounded-md max-h-[198px] overflow-y-auto divide-y divide-slate-100">
                            {expense_categories?.length ? (
                                [...expense_categories]
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name),
                                    )
                                    .map((cat) => (
                                        <div
                                            key={cat.id}
                                            className="px-3 py-2 hover:bg-slate-50"
                                        >
                                            <p className="text-sm font-medium text-gray-800">
                                                {cat.name}
                                            </p>
                                            {cat.description && (
                                                <p className="text-xs text-gray-500">
                                                    {cat.description}
                                                </p>
                                            )}
                                        </div>
                                    ))
                            ) : (
                                <p className="px-3 py-4 text-sm text-gray-400 text-center">
                                    No categories yet
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
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
                            Save Category
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
