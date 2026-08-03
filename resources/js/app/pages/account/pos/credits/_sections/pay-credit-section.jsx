import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState, useEffect } from "react";
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
        getValues, // <-- Added getValues to fetch live form state during validation
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            amount: "",
            due_date: "", 
            isPartialPayment: false,
            modeOfPayment: "Cash",
        },
    });

    const watchedValues = watch();
    const balance = parseFloat(props_data?.balance || 0);
    const customerName = props_data?.customer?.name || "Unknown Customer";

    // Watch values to handle dynamic rendering and calculations
    const amountValue = watch("amount");
    const isPartialPayment = watch("isPartialPayment");

    // Calculate remaining balance dynamically
    const currentBalance = Math.max(0, balance - (parseFloat(amountValue) || 0));

    // Automatically set amount to full balance if user unchecks "Partial Payment"
    useEffect(() => {
        if (!isPartialPayment && open) {
            setValue("amount", balance.toString(), { shouldValidate: true });
        }
    }, [isPartialPayment, balance, setValue, open]);

    const formatCurrency = (amount) => {
        return `₱ ${Number(amount || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handlePayFullAmount = () => {
        setValue("amount", balance.toString(), { shouldValidate: true });
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
                        <p>Customer Name: {customerName}</p>
                        <p>Balance: {formatCurrency(balance)}</p>
                        <p>Current Balance: {formatCurrency(currentBalance)}</p>
                    </div>

                    {/* PARTIAL PAYMENT CHECKBOX */}
                    <div className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            id="isPartialPayment"
                            {...register("isPartialPayment")}
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
                                label="Next Due Date"
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
                                min: { value: 0.01, message: "Amount must be greater than 0" },
                                max: { value: balance, message: `Amount cannot exceed ${formatCurrency(balance)}` },
                                // FIXED: Using getValues() guarantees it checks the live state of the checkbox
                                validate: (value) => {
                                    const parsedValue = parseFloat(value) || 0;
                                    const isPartial = getValues("isPartialPayment");
                                    if (!isPartial && parsedValue < balance) {
                                        return `You must pay the full amount or check "Partial Payment".`;
                                    }
                                    return true;
                                }
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
                                Pay Full Amount ({formatCurrency(balance)})
                            </button>
                        </div>
                    )}
                    {/* MODE OF PAYMENT DROPDOWN */}
                    <div className="mt-2">
                        <Select
                            label="Mode of Payment"
                            {...register("modeOfPayment", { required: "Please select a payment mode" })}
                            error={errors?.modeOfPayment?.message}
                            value={watchedValues?.modeOfPayment}
                            className="w-full text-gray-600"
                            options={[
                                { label: "Cash", value: "Cash" },
                                { label: "GCash", value: "E-Wallet" },
                                { label: "Bank Transfer", value: "Bank Transfer" },
                                { label: "Credit Card", value: "Credit/Debit Card" }
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