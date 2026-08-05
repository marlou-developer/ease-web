import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
    Pencil,
    AlertCircle,
    CreditCard,
    Receipt,
    Tag,
    Percent,
    Banknote,
    Wallet
} from "lucide-react";
import { pos_sales_change_status_service } from "@/app/services/pos/pos-sales-service";
import store from "@/app/store/store";
import { get_pos_sales_thunk } from "@/app/redux/pos/pos-thunk";

export default function SalesUpdateStatus({ props_data }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("payment"); // Added state for Tabs
    const dispatch = useDispatch();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            status: null,
        },
    });

    const selectedStatus = watch("status");

    const onSubmit = async (formData) => {
        try {
            await pos_sales_change_status_service({
                id: props_data.id,
                status: formData.status,
                items: props_data?.sale_items ?? []
            });
            store.dispatch(get_pos_sales_thunk())
            setOpen(false);
            reset();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Status updated successfully!",
                }),
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to update status.",
                }),
            );
            console.error("Error updating status:", error);
        }
    };

    // Helper to format date if available
    const formattedDate = props_data?.created_at
        ? new Date(props_data.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'N/A';

    return (
        <>
            <Button
                onClick={() => {
                    setOpen(true);
                    setActiveTab("payment"); // Reset to first tab on open
                    reset();
                }}
                variant="info"
                className="group"
            >
                <div className="flex gap-2 items-center justify-center transition-all duration-200">
                    <Pencil size={18} />
                </div>
            </Button>

            <Modal
                title={`Update Sales Status - ${props_data?.invoice_no || ''}`}
                width="max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                {/* --- Tabs Navigation --- */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab("payment")}
                        className={`py-2 px-6 text-sm font-semibold border-b-2 outline-none transition-colors duration-200 ${activeTab === "payment"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Payment Details
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("items")}
                        className={`py-2 px-6 text-sm font-semibold border-b-2 outline-none transition-colors duration-200 ${activeTab === "items"
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Sale Items
                    </button>
                </div>

                {/* --- Tab Content Area --- */}
                <div className="min-h-[250px]">
                    {/* Tab 1: Payment Details */}
                    {activeTab === "payment" && (
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-blue-50 text-blue-600 font-bold text-[11px] tracking-wider px-3 py-1.5 rounded-full uppercase">
                                    Financial Overview
                                </span>
                                <span className="text-gray-500 font-mono text-sm">
                                    Date: {formattedDate}
                                </span>
                            </div>

                            <hr className="border-gray-100 mb-4" />

                            {/* Split Payment Details into a 2-Column Grid for better layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <CreditCard size={18} className="text-blue-500" />
                                        <span className="text-sm">Payment Type</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                        {props_data?.payment_type || 'N/A'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Receipt size={18} className="text-blue-500" />
                                        <span className="text-sm">Total Amount</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                        ₱{props_data?.total_amount || '0.00'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Tag size={18} className="text-blue-500" />
                                        <span className="text-sm">Discount</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                        ₱{props_data?.discount || '0.00'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Percent size={18} className="text-blue-500" />
                                        <span className="text-sm">Tax</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                        ₱{props_data?.tax || '0.00'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Banknote size={18} className="text-blue-500" />
                                        <span className="text-sm">Amount Paid</span>
                                    </div>
                                    <span className="text-gray-800 font-medium text-sm">
                                        ₱{props_data?.amount_paid || '0.00'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <Wallet size={18} className="text-blue-500" />
                                        <span className="text-sm">Balance</span>
                                    </div>
                                    <span className={`font-medium text-sm ${parseFloat(props_data?.balance) > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                        ₱{props_data?.balance || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Sale Items */}
                    {activeTab === "items" && (
                        <div className="animate-in fade-in duration-300">
                            {props_data?.sale_items?.length > 0 ? (
                                <ul className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2">
                                    {props_data.sale_items.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md hover:bg-blue-50 hover:border-blue-200 cursor-default"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 transition-colors duration-200">
                                                    {item?.pos_product_stock?.product?.name || `Product ID: ${item.pos_product_stock_id}`}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    Qty: <strong className="text-gray-700">{item.quantity}</strong> @ ₱{item.selling_price}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 font-medium">Total</span>
                                                <span className="font-semibold text-gray-800 text-lg">
                                                    ₱{item.total}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md p-8 text-center mt-4">
                                    <p className="text-sm text-gray-500 italic">No items found for this sale.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <hr className="border-gray-200 my-6" />

                {/* --- Form Section (Always Visible at the bottom) --- */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <div className="group transition-all duration-200">
                        <Controller
                            name="status"
                            control={control}
                            rules={{ required: "Status is required to proceed." }}
                            render={({ field, fieldState: { error } }) => (
                                <div className="flex flex-col w-full">
                                    <Select
                                        {...field}
                                        label="Select Status"
                                        options={["Paid", "Returned", "Pending", "Partial"].map(
                                            (res) => ({
                                                value: res,
                                                label: res,
                                            })
                                        )}
                                    />

                                    {error && (
                                        <span className="text-red-500 text-xs font-medium mt-1">
                                            {error.message}
                                        </span>
                                    )}

                                    {/* Conditional Note for "Returned" status */}
                                    {selectedStatus === "Returned" && (
                                        <div className="flex gap-2 items-start mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                                            <p className="text-sm font-medium">
                                                Note: Setting this status to "Returned" will mark all items in this transaction as returned. Are you sure you want to return all items?
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-2">
                        <Button
                            type="button"
                            variant="danger"
                            outlined
                            onClick={() => setOpen(false)}
                            className="hover:bg-red-50 transition-colors duration-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={isSubmitting}
                            className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Save Status
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}