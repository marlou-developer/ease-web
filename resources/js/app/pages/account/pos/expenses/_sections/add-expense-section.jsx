import React, { useEffect, useState } from "react";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { Plus, Edit2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_pos_expenses_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import {
    add_pos_expense_service,
    update_pos_expense_service,
} from "@/app/services/pos/pos-expense-service";

export default function AddExpenseSection({ expense = null }) {
    const isEdit = Boolean(expense);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { expense_categories } = useSelector((store) => store.pos);
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            pos_expense_category_id: "",
            title: "",
            amount: "",
            expense_date: "",
            description: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                pos_expense_category_id: expense?.pos_expense_category_id ?? "",
                title: expense?.title ?? "",
                amount: expense?.amount ?? "",
                expense_date: expense?.expense_date ?? "",
                description: expense?.description ?? "",
            });
        }
    }, [open, expense]);

    const onSubmit = async (data) => {
        try {
            if (isEdit) {
                await update_pos_expense_service(expense.id, data);
            } else {
                await add_pos_expense_service(data);
            }
            await store.dispatch(get_pos_expenses_thunk());
            setOpen(false);
            dispatch(
                setAlert({
                    type: "success",
                    title: `Expense ${isEdit ? "updated" : "created"} successfully!`,
                }),
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: `Expense ${isEdit ? "update" : "creation"} unsuccessful!`,
                }),
            );
            console.error("Error saving expense:", error);
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
                        <Plus size={18} /> Add Expense
                    </div>
                </Button>
            )}

            <Modal
                title={isEdit ? "Edit Expense" : "Add Expense"}
                width="max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <Controller
                        name="pos_expense_category_id"
                        control={control}
                        rules={{ required: "Category is required" }}
                        render={({
                            field: { onChange, value, ...restField },
                        }) => (
                            <Select
                                label="Select Expense Category"
                                options={
                                    expense_categories?.map((cat) => ({
                                        value: cat.id,
                                        label: cat.name,
                                    })) || []
                                }
                                error={errors?.pos_expense_category_id?.message}
                                value={value}
                                {...restField}
                                onChange={onChange}
                                required
                            />
                        )}
                    />

                    <Input
                        label="Title"
                        {...register("title", {
                            required: "Title is required",
                        })}
                        error={errors.title}
                        required
                    />

                    <div className="flex gap-3">
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("amount", {
                                required: "Amount is required",
                                min: { value: 0, message: "Min 0" },
                            })}
                            error={errors.amount}
                            required
                        />

                        <Input
                            label="Date"
                            type="date"
                            {...register("expense_date")}
                            error={errors.expense_date}
                        />
                    </div>

                    <Input
                        label="Description"
                        {...register("description")}
                        error={errors.description}
                    />

                    <hr className="my-2" />

                    {/* Actions */}
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
                            Save Expense
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
