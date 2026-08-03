import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import store from "@/app/store/store";
import { get_pos_customer_thunk, get_pos_sales_thunk } from "@/app/redux/pos/pos-thunk";
import { add_credit_payment_service } from "@/app/services/index/users-service";

export default function PayCreditSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            amount: "",
            due_date: "", // Added date to default values
            isPartialPayment: false,
            modeOfPayment: "",
        },
    });
    console.log('props_data',props_data)

    // Watch values to handle dynamic rendering and calculations
    const amountValue = watch("amount");
    const isPartialPayment = watch("isPartialPayment"); // Watch the checkbox state

    const currentBalance = props_data?.balance - (parseFloat(amountValue) || 0);

    const formatCurrency = (amount) => {
        return `₱ ${amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handlePayFullAmount = () => {
        setValue("amount", props_data?.balance.toString(), { shouldValidate: true });
        setValue("isPartialPayment", false);
    };

    const onSubmit = async (formData) => {
        try {
            await add_credit_payment_service({
                ...props_data,
                payment: formData
            });
            await store.dispatch(get_pos_sales_thunk());
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Payment processed successfully!",
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to process payment.",
                })
            );
            console.error("Error processing payment:", error);
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
                    <Plus size={18} /> Add Payment
                </div>
            </Button>

            <Modal
                title="Add Payment"
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 mt-2"
                >
                    {/* CUSTOMER DETAILS SECTION */}
                    <div className="flex flex-col gap-1 text-[15px] font-medium text-gray-900">
                        <p>Customer Name: {props_data?.props_data?.name}</p>
                        <p>Balance: {formatCurrency(props_data?.balance)}</p>
                        <p>Current Balance: {formatCurrency(currentBalance > 0 ? currentBalance : 0)}</p>
                    </div>

                    {/* PARTIAL PAYMENT CHECKBOX */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="isPartialPayment"
                            {...register("isPartialPayment")}
                            // Added accent-pink-500 to color the checked box pink
                            className="w-5 h-5 text-pink-500 bg-white border-pink-400 rounded focus:ring-pink-500 focus:ring-2 accent-pink-500"
                        />
                        <label htmlFor="isPartialPayment" className="text-gray-800 cursor-pointer">
                            Partial Payment
                        </label>
                    </div>

                    {/* CONDITIONAL DATE INPUT */}
                    {isPartialPayment && (
                        <div>
                            <Input
                                label="Due Date"
                                type="date"
                                {...register("due_date", {
                                    required: isPartialPayment ? "Due date is required" : false
                                })}
                                error={errors?.due_date?.message}
                            />
                        </div>
                    )}

                    {/* AMOUNT INPUT */}
                    <div>
                        <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            {...register("amount", {
                                required: "Amount is required",
                                min: { value: 1, message: "Amount must be greater than 0" }
                            })}
                            error={errors?.amount?.message}
                        />
                    </div>

                    {/* CONDITIONAL PAY FULL AMOUNT BUTTON */}
                    {!isPartialPayment && (
                        <div>
                            <button
                                type="button"
                                onClick={handlePayFullAmount}
                                className="px-3 py-1.5 text-sm font-medium text-blue-500 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                            >
                                Pay Full Amount ({formatCurrency(props_data?.balance)})
                            </button>
                        </div>
                    )}

                    {/* MODE OF PAYMENT DROPDOWN */}
                    <div className="mt-2">
                        <Select
                            label="Mode of Payment"
                            {...register("modeOfPayment", { required: "Please select a payment mode" })}
                            error={errors?.modeOfPayment?.message}
                            className="w-full text-gray-600"
                            options={[
                                { label: "Cash", value: "cash" },
                                { label: "GCash", value: "gcash" },
                                { label: "Bank Transfer", value: "bank_transfer" },
                                { label: "Credit Card", value: "credit_card" }
                            ]}
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="mt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            loading={isSubmitting}
                        >
                            ADD PAYMENT
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}