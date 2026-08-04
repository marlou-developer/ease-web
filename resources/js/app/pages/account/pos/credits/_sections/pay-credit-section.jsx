import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Plus, History, CreditCard } from "lucide-react";
import store from "@/app/store/store";
import { get_pos_customer_thunk, get_pos_sales_thunk } from "@/app/redux/pos/pos-thunk";
import { add_credit_payment_service } from "@/app/services/index/users-service";

export default function PayCreditSection({ props_data }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("payment"); // 'payment' | 'history'
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        getValues,
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

    // Replace 'payments' with your actual array property name from your backend
    const paymentHistory = props_data?.payments || [];

    const amountValue = watch("amount");
    const isPartialPayment = watch("isPartialPayment");
    const currentBalance = Math.max(0, balance - (parseFloat(amountValue) || 0));

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

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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
                    setActiveTab("payment"); // Reset to payment tab on open
                    reset();
                }}
                variant="primary"
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Payment
                </div>
            </Button>

            <Modal
                title="Credit Details"
                width="max-w-md"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className="w-full flex flex-col pt-2 pb-4">

                    {/* TABS HEADER */}
                    <div className="flex border-b border-gray-200 mb-5">
                        <button
                            onClick={() => setActiveTab("payment")}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === "payment"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <CreditCard size={16} />
                            New Payment
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === "history"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <History size={16} />
                            Payment History
                        </button>
                    </div>

                    {/* PAYMENT TAB CONTENT */}
                    {activeTab === "payment" && (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-5 w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
                        >
                            <div className="flex flex-col gap-2 p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-800">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Customer:</span>
                                    <span className="font-semibold">{customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-500">Total Balance:</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(balance)}</span>
                                </div>
                                <div className="flex justify-between pt-2 mt-1 border-t border-gray-200">
                                    <span className="font-medium text-gray-500">Remaining After Payment:</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(currentBalance)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-1">
                                <input
                                    type="checkbox"
                                    id="isPartialPayment"
                                    {...register("isPartialPayment")}
                                    className="w-5 h-5 text-pink-500 bg-white border-gray-300 rounded focus:ring-pink-500 focus:ring-2 accent-pink-500 cursor-pointer"
                                />
                                <label htmlFor="isPartialPayment" className="text-sm font-medium text-gray-800 cursor-pointer select-none">
                                    This is a Partial Payment
                                </label>
                            </div>

                            {isPartialPayment && (
                                <div className="w-full animate-in fade-in slide-in-from-top-2">
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

                            <div className="flex flex-col gap-2 w-full">
                                <Input
                                    label="Amount to Pay"
                                    type="number"
                                    step="0.01"
                                    {...register("amount", {
                                        required: "Amount is required",
                                        min: { value: 0.01, message: "Amount must be greater than 0" },
                                        max: { value: balance, message: `Amount cannot exceed ${formatCurrency(balance)}` },
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

                                {!isPartialPayment && (
                                    <button
                                        type="button"
                                        onClick={handlePayFullAmount}
                                        className="self-start text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition-colors"
                                    >
                                        Insert Full Amount ({formatCurrency(balance)})
                                    </button>
                                )}
                            </div>

                            <div className="w-full">
                                <Select
                                    label="Mode of Payment"
                                    {...register("modeOfPayment", { required: "Please select a payment mode" })}
                                    error={errors?.modeOfPayment?.message}
                                    value={watchedValues?.modeOfPayment}
                                    className="w-full text-gray-800"
                                    options={[
                                        { label: "Cash", value: "Cash" },
                                        { label: "GCash", value: "E-Wallet" },
                                        { label: "Bank Transfer", value: "Bank Transfer" },
                                        { label: "Credit Card", value: "Credit/Debit Card" }
                                    ]}
                                />
                            </div>

                            <div className="mt-4 w-full">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-2.5 text-base"
                                    loading={isSubmitting}
                                >
                                    Process Payment
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* HISTORY TAB CONTENT */}
                    {activeTab === "history" && (
                        <div className="flex flex-col w-full min-h-[300px] max-h-[450px] overflow-y-auto pr-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {paymentHistory.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {paymentHistory.map((payment, index) => (
                                        <div key={index} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-colors">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(payment.amount)}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    {payment.modeOfPayment || "Cash"} • {formatDate(payment.created_at || payment.date)}
                                                </span>
                                            </div>
                                            <div className="flex">
                                                <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-green-700 bg-green-100 rounded-full">
                                                    Success
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-10">
                                    <History size={40} className="text-gray-300 mb-3" />
                                    <p className="text-sm font-medium text-gray-600">No payment history yet.</p>
                                    <p className="text-xs mt-1">When payments are made, they will appear here.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </Modal>
        </>
    );
}