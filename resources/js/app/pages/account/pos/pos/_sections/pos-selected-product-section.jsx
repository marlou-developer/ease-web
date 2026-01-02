import {
    setAmountPaid,
    setCart,
    setHeldSales,
} from "@/app/redux/pos/pos-product-slice";
import { Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NumberKeyboard from "./pos-keyboard-section";

export default function POSSelectedProductSection() {
    const { cart, cartDetail, heldSales, amountPaid } = useSelector(
        (store) => store.pos_products
    );
    const dispatch = useDispatch();
    const holdSale = () => {
        if (cart.length === 0) return alert("Cannot hold an empty cart");
        const newHold = {
            id: Date.now(),
            items: cart,
            total: cartDetail.grandTotal,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        dispatch(setHeldSales([...heldSales, newHold]));
        dispatch(setCart([]));
        dispatch(setAmountPaid(0));
    };

    const updateQty = (id, delta) => {
        dispatch(
            setCart(
                cart
                    .map((item) =>
                        item.id === id
                            ? { ...item, qty: Math.max(0, item.qty + delta) }
                            : item
                    )
                    .filter((item) => item.qty > 0)
            )
        );
    };

    return (
        <>
            <div className="bg-blue-600 text-white p-3 font-bold flex justify-between">
                <span>Current Sale</span>
                <span className="text-xs opacity-80">
                    {new Date().toLocaleDateString()}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                <table className="w-full text-sm">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="py-2 text-left">Item</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id} className="border-b">
                                <td className=" font-medium">{item.name}</td>
                                <td className="py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQty(item.id, -1)
                                            }
                                            className="px-2 border rounded bg-white"
                                        >
                                            -
                                        </button>
                                        <span>{item.qty}</span>
                                        <button
                                            onClick={() =>
                                                updateQty(item.id, 1)
                                            }
                                            className="px-2 border rounded bg-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="py-3 text-right font-bold">
                                    ${(item.price * item.qty).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <NumberKeyboard
                    value={`${amountPaid}`}
                    onChange={(value) => dispatch(setAmountPaid(value))}
                />
            </div>
            <div className="p-4 bg-gray-50 border-t space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>{" "}
                    <span>${cartDetail.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Tax (6%)</span>{" "}
                    <span>${cartDetail.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black border-t pt-2">
                    <span>Total</span>{" "}
                    <span>${cartDetail.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => dispatch(setCart([]))}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded font-bold hover:bg-gray-100"
                    >
                        <Trash2 size={16} /> Clear
                    </button>
                    <button
                        onClick={holdSale}
                        className="flex-1 bg-red-500 text-white py-2 rounded font-bold hover:bg-red-600"
                    >
                        Hold Sale
                    </button>
                </div>
            </div>
        </>
    );
}
