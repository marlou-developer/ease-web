import React, { useState, useEffect } from "react";
import { ShoppingCart, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    setAmountPaid,
    setCart,
    setCartDetail,
    setHeldSales,
} from "@/app/redux/pos/pos-product-slice";

export default function POSCheckout() {
    const { cartDetail, heldSales, cart, amountPaid, tax } = useSelector(
        (store) => store.pos_products
    );
    const dispatch = useDispatch();

    // Load held sales from localStorage on start
    useEffect(() => {
        const saved = localStorage.getItem("heldSales");
        if (saved) dispatch(setHeldSales(JSON.parse(saved)));
    }, []);

    useEffect(() => {
        const subtotal = cart.reduce(
            (acc, item) => acc + item.price * item.qty,
            0
        );
        const tax = subtotal * cartDetail.tax; // cartDetail.tax should be 0.12 for 12%
        const grandTotal = subtotal + tax;
        const changeDue = Math.max(0, amountPaid - grandTotal);

        dispatch(
            setCartDetail({
                ...cartDetail,
                subtotal,
                grandTotal,
                changeDue,
            })
        );
    }, [cart, cartDetail.tax, amountPaid]);

    useEffect(() => {
        localStorage.setItem("heldSales", JSON.stringify(heldSales));
    }, [heldSales]);

    const restoreSale = (sale) => {
        if (
            cart.length > 0 &&
            !window.confirm("Overwrite current cart with held sale?")
        )
            return;
        dispatch(setCart(sale.items));
        dispatch(setHeldSales(heldSales.filter((h) => h.id !== sale.id)));
    };

    const isDisabled = () => {
        if (cart.length === 0) return true;
        if (
            cart.length != 0 &&
            Number(cartDetail.grandTotal) > Number(amountPaid)
        )
            return true;
        if (
            cart.length != 0 &&
            Number(cartDetail.grandTotal) == Number(amountPaid)
        )
            return false;
        return false;
    };

    return (
        <>
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 border-b pb-2">
                {cart.length}
                <img
                    src="https://cdn-icons-png.flaticon.com/128/263/263142.png"
                    alt="Cart Icon"
                    width={20}
                    height={20}
                />
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
                            const cleaned = parseFloat(amountPaid) || 0;
                        }}
                        className="w-full p-3 border rounded text-2xl font-bold text-right focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded border">
                    <span className="text-sm text-gray-500">Change Due</span>
                    <span className="text-2xl font-black text-green-600">
                        ${cartDetail.changeDue.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={() => alert("Sale Completed!")}
                    // Convert both sides to Number to ensure accurate numeric comparison
                    disabled={isDisabled()}
                    className={`w-full py-4 rounded-xl font-black text-xl shadow-lg transition-all
    ${
        isDisabled()
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
                                    className="flex justify-between items-center p-2 bg-yellow-100 border border-yellow-200 rounded text-xs"
                                >
                                    <div>
                                        <p className="font-bold">{sale.time}</p>
                                        <p className="text-gray-600">
                                            ${sale.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restoreSale(sale)}
                                        className="p-1 bg-white rounded shadow hover:text-blue-600"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
