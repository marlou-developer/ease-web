import React, { useState, useEffect } from "react";
import { ShoppingCart, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    setAmountPaid,
    setCart,
    setCartDetail,
    setHeldSales,
    setOverAllProductDiscount,
} from "@/app/redux/pos/pos-slice";
import { create_pos_sales_service } from "@/app/services/pos/pos-sales-service";
import Swal from "sweetalert2";
import store from "@/app/store/store";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-thunk";
import Radio from "@/app/_components/radio";
import Checkbox from "@/app/_components/checkbox";
import Select from "@/app/_components/select";
import { Controller, useForm } from "react-hook-form";
import { FcPortraitMode } from "react-icons/fc";
import Input from "@/app/_components/input";

export default function POSCheckout() {
    const { cartDetail, heldSales, cart, amountPaid, tax, overall_all_product_discount, customers } = useSelector(
        (store) => store.pos,
    );

    const {
        control,
        handleSubmit,
        setValue,
        register,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            customer_id: '',
            due_date: ''
        }
    });

    const watchedValues = watch()

    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState('Cash');
    const [isCustomer, setIsCustomer] = useState(false);
    const [isCredit, setIsCredit] = useState(false);
    const dispatch = useDispatch();

    // Load held sales from localStorage on start
    useEffect(() => {
        const saved = localStorage.getItem("heldSales");
        if (saved) dispatch(setHeldSales(JSON.parse(saved)));
    }, [dispatch]);

    const total_total_discount = cart?.reduce((accumulator, currentItem) => {
        return (accumulator + Number(currentItem.discount || 0));
    }, 0);

    useEffect(() => {
        const subtotal = cart.reduce(
            (acc, item) => acc + item.price * item.qty,
            0,
        );
        const currentTax = subtotal * (cartDetail.tax || 0);
        const grandTotal = subtotal + currentTax;

        const change = Math.max(0, Number(amountPaid) - (grandTotal - (total_total_discount + (overall_all_product_discount || 0)))) || 0;

        dispatch(
            setCartDetail({
                ...cartDetail,
                subtotal,
                grandTotal,
                changeDue: change,
            }),
        );
    }, [cart, cartDetail.tax, amountPaid, total_total_discount, overall_all_product_discount, dispatch]);

    useEffect(() => {
        localStorage.setItem("heldSales", JSON.stringify(heldSales));
    }, [heldSales]);

    const restoreSale = (sale) => {
        if (cart.length > 0 && !window.confirm("Overwrite current cart with held sale?")) return;
        dispatch(setCart(sale.items));
        dispatch(setHeldSales(heldSales.filter((h) => h.id !== sale.id)));
    };

    const isDisabled = () => {
        if (cart.length === 0) return true;
        if (loading) return true;
        if (isCustomer && !watchedValues.customer_id) return true;
        if (isCredit && !watchedValues.due_date) return true;
        const netTotal = Number(cartDetail.grandTotal - (total_total_discount + (overall_all_product_discount || 0)));
        if (netTotal > Number(amountPaid)) return true;

        return false;
    };

    // ✅ Pass formData from react-hook-form into this function
    async function submit_sales(formData) {
        try {
            setLoading(true);
            await create_pos_sales_service({
                customer_id: formData.customer_id,
                due_date: formData.due_date,
                payment_type: paymentType,
                is_credit: isCredit,
                is_customer: isCustomer,
                discount: overall_all_product_discount || 0,
                amount_paid: Number(amountPaid), // Ensure this is a number
                change_due: Number(cartDetail.changeDue).toFixed(2),
                items: cart.map((res) => ({
                    pos_product_stock_id: res.id,
                    quantity: res.qty,
                    pos_supplier_id: res?.pos_supplier_id,
                    pos_category_id: res?.pos_category_id,
                    cost_price: Number(res.cost_price).toFixed(2),
                    selling_price: Number(res.price).toFixed(2),
                    discount: res.discount || 0,
                })),
            });

            await store.dispatch(get_pos_product_stocks_thunk());
            await Swal.fire({
                icon: "success",
                title: "Sale Completed Successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            dispatch(setCart([]));
            dispatch(setAmountPaid(0));
            dispatch(setOverAllProductDiscount(0));

            // Optional: reset form and checkboxes here
            setIsCustomer(false);
            setIsCredit(false);
            setPaymentType('Cash');

        } catch (error) {
            console.error("Error submitting sale:", error);
            Swal.fire({ icon: "error", title: "Error", text: "Failed to process sale." });
        } finally {
            setLoading(false);
        }
    }

    // ✅ Triggered by react-hook-form handleSubmit
    const onFormSubmit = async (data) => {
        const result = await Swal.fire({
            title: "Payment Confirmation!",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                await submit_sales(data); // Pass form data to API
            },
        });

        if (result.isConfirmed) {
            console.log("Sales submitted successfully");
        }
    };

    return (
        // ✅ Wrapped everything in a form tag to utilize react-hook-form
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col h-full">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
                <span className="bg-blue-100 text-blue-800 px-2 rounded-full text-sm">{cart.length}</span>
                <ShoppingCart size={20} className="text-gray-500" />
                Checkout
            </h3>

            <div className="space-y-4 flex-1">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Amount Paid
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        value={amountPaid}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || /^\d*\.?\d*$/.test(val)) {
                                dispatch(setAmountPaid(val));
                            }
                        }}
                        onBlur={() => {
                            // ✅ Fixed: Actually dispatch the cleaned value
                            const cleaned = parseFloat(amountPaid) || 0;
                            dispatch(setAmountPaid(cleaned));
                        }}
                        className="w-full p-3 border rounded text-2xl font-bold text-right focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <span className="text-sm text-gray-500">Change Due</span>
                    <span className="text-2xl font-black text-green-600">
                        ₱{Number(cartDetail.changeDue || 0).toFixed(2)}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="font-bold">Payment Method</div>
                    <div className="flex gap-3 items-center justify-evenly">
                        <div className="flex flex-col gap-2">
                            <Radio
                                name="payment_type"
                                label="Cash"
                                value="Cash"
                                checked={paymentType === "Cash"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                            <Radio
                                name="payment_type"
                                label="E-Wallet"
                                value="E-Wallet"
                                checked={paymentType === "E-Wallet"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Radio
                                name="payment_type"
                                label="Bank Transfer"
                                value="Bank Transfer"
                                checked={paymentType === "Bank Transfer"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                            <Radio
                                name="payment_type"
                                label="Credit/Debit Card"
                                value="Credit/Debit Card"
                                checked={paymentType === "Credit/Debit Card"}
                                onChange={(e) => setPaymentType(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="my-5 flex flex-col gap-3 border-t pt-3">

                        <div className="font-bold">Other Option</div>
                        <Checkbox
                            onChange={(e) => setIsCustomer(e.target.checked)}
                            name="is_customer"
                            label="Is Customer?"
                            checked={isCustomer}
                        />

                        {isCustomer && (
                            <>
                                <Checkbox
                                    onChange={(e) => setIsCredit(e.target.checked)}
                                    name="is_credit"
                                    label="Is Credit?"
                                    checked={isCredit}
                                />
                                <div className="my-1" />
                                <Controller
                                    name="customer_id"
                                    control={control}
                                    rules={{ required: "Customer is required" }}
                                    render={({ field: { onChange, value, ...restField } }) => (
                                        <Select
                                            iconLeft={<FcPortraitMode className='text-2xl' />}
                                            label={<div className="ml-6">Select Customer</div>}
                                            options={customers.map(res => ({
                                                label: res.name,
                                                value: res.id
                                            }))} // Populate your customer options here
                                            value={value}
                                            onChange={onChange}
                                            error={errors?.customer_id?.message}
                                            {...restField}
                                        />
                                    )}
                                />
                            </>
                        )}

                        {/* ✅ Only show Due Date if it is a credit sale */}
                        {isCredit && (
                            <Input
                                label="Due Date"
                                type="date"
                                name="due_date"
                                {...register("due_date", {
                                    required: "Due Date is required for credit sales",
                                })}
                                error={errors?.due_date?.message}
                            />
                        )}
                    </div>
                </div>

                {/* ✅ Changed to type="submit" so it triggers React Hook Form validations */}
                <button
                    type="submit"
                    disabled={isDisabled()}
                    className={`w-full py-4 rounded-xl font-black text-xl shadow-lg transition-all mt-4
                          ${isDisabled()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                        }`}
                >
                    COMPLETE SALE
                </button>

                {/* HELD SALES LIST */}
                {heldSales.length > 0 && (
                    <div className="mt-8 border-t pt-4">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                            Held Sales ({heldSales.length})
                        </p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {heldSales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-200 rounded text-xs"
                                >
                                    <div>
                                        <p className="font-bold">{sale.time}</p>
                                        <p className="text-gray-600">
                                            ₱{sale.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        type="button" // Keep as type="button" to avoid form submission
                                        onClick={() => restoreSale(sale)}
                                        className="p-2 bg-white rounded shadow hover:text-blue-600 transition-colors"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </form>
    );
}