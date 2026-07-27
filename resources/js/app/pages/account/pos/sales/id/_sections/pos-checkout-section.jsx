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
import { add_sales_items_service, create_pos_sales_service } from "@/app/services/pos/pos-sales-service";
import Swal from "sweetalert2";
import store from "@/app/store/store";
import { get_pos_product_stocks_thunk, get_pos_sales_by_id_thunk } from "@/app/redux/pos/pos-thunk";
import Radio from "@/app/_components/radio";
import Checkbox from "@/app/_components/checkbox";
import Select from "@/app/_components/select";
import { Controller, useForm } from "react-hook-form";
import { FcPortraitMode } from "react-icons/fc";
import Input from "@/app/_components/input";

export default function POSCheckout({ setOpen }) {
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


    // ✅ Pass formData from react-hook-form into this function
    async function submit_sales(formData) {
        try {
            setLoading(true);
            await add_sales_items_service({
                pos_sale_id: window.location.pathname.split('/')[4],
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

            await store.dispatch(get_pos_sales_by_id_thunk(window.location.pathname.split('/')[4]))
            await store.dispatch(get_pos_product_stocks_thunk())
            await Swal.fire({
                icon: "success",
                title: "Sale Completed Successfully",
                showConfirmButton: false,
                timer: 1500,
            });

            dispatch(setCart([]));
            dispatch(setAmountPaid(0));
            dispatch(setOverAllProductDiscount(0));
            setOpen(false)
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


                <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <span className="text-sm text-gray-500">Change Due</span>
                    <span className="text-2xl font-black text-green-600">
                        ₱{Number(cartDetail.changeDue || 0).toFixed(2)}
                    </span>
                </div>


                {/* ✅ Changed to type="submit" so it triggers React Hook Form validations */}
                <button
                    type="submit"
                    className={`w-full py-4 rounded-xl font-black text-xl shadow-lg transition-all mt-4
                          bg-green-600 text-white hover:bg-green-700 active:scale-95`}
                >
                    ADD PRODUCT SALES
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