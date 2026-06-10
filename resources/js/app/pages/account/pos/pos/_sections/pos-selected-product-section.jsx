import {
    setAmountPaid,
    setCart,
    setHeldSales,
} from "@/app/redux/pos/pos-slice";
import { Trash2 } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import NumberKeyboard from "./pos-keyboard-section";
import peso_value from "@/app/lib/peso-value";
import PosOverallDiscount from "./pos-overall-discount";

export default function POSSelectedProductSection() {
    const { cart, cartDetail, heldSales, amountPaid } = useSelector(
        (store) => store.pos
    );
    const dispatch = useDispatch();

    const total_total_discount = cart?.reduce((accumulator, currentItem) => {
        return (accumulator + Number(currentItem.discount || 0));
    }, 0);

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
        const itemToUpdate = cart.find(item => item.id === id);
        if (!itemToUpdate) return;

        const currentQty = Number(itemToUpdate.qty) || 0;
        const newQty = Math.max(0, currentQty + delta);

        if (newQty > itemToUpdate.stocks) {
            return alert('Insufficient Supply');
        }

        dispatch(
            setCart(
                cart
                    .map((item) => (item.id === id ? { ...item, qty: newQty } : item))
                    .filter((item) => item.qty > 0)
            )
        );
    };

    const handleQtyChange = (id, value, stocks) => {
        const parsedQty = parseInt(value, 10);
        const newQty = isNaN(parsedQty) ? "" : parsedQty;

        if (newQty === "" || stocks >= newQty) {
            dispatch(
                setCart(
                    cart.map((item) =>
                        item.id === id ? { ...item, qty: newQty } : item
                    )
                )
            );
        } else {
            alert('Insufficient Supply');
        }
    };

    const updateDiscount = (id, value) => {
        // Convert the input directly to a number, defaulting to 0 if empty
        const numericValue = parseFloat(value) || 0;

        dispatch(
            setCart(
                cart.map((item) => {
                    if (item.id === id) {
                        const validDiscount = numericValue;
                        return {
                            ...item,
                            discount: validDiscount
                        };
                    }
                    return item;
                })
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
                            <th className="py-2 text-left">Discount</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => {
                            const itemSrp = Number(item.srp) || 0;
                            const itemQty = Number(item.qty) || 0;
                            const itemDiscount = Number(item.discount) || 0;
                            // Calculate net price safely line-by-line
                            const rowNetTotal = (itemSrp * itemQty) - itemDiscount;

                            return (
                                <tr key={item.id} className="border-b">
                                    <td className="font-medium py-2">
                                        <div className="text-gray-900">{item.name}</div>
                                        <div className="text-xs text-gray-400 font-normal">SRP: ₱{itemSrp.toFixed(2)}</div>
                                    </td>
                                    <td className="py-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max={itemSrp * itemQty}
                                            onChange={(e) =>
                                                updateDiscount(item.id, e.target.value)
                                            }
                                            placeholder="0.00"
                                            className="w-24 h-8 px-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                                        />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => updateQty(item.id, -1)}
                                                className="px-2 h-8 border rounded bg-white hover:bg-gray-50 active:bg-gray-100"
                                            >
                                                -
                                            </button>
                                            <span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.qty}
                                                    onChange={(e) => handleQtyChange(item.id, e.target.value, item.stocks)}
                                                    onBlur={(e) => {
                                                        if (!e.target.value || parseInt(e.target.value) <= 0) {
                                                            dispatch(setCart(cart.filter(i => i.id !== item.id)));
                                                        }
                                                    }}
                                                    placeholder="0"
                                                    className="w-12 text-center h-8 px-2 border border-gray-300 rounded outline-none focus:border-blue-500"
                                                />
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, 1)}
                                                className="px-2 h-8 border rounded bg-white hover:bg-gray-50 active:bg-gray-100"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-3 text-right font-bold text-gray-800">
                                        ₱{rowNetTotal.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div>
                <NumberKeyboard
                    value={`${amountPaid}`}
                    onChange={(value) => dispatch(setAmountPaid(value))}
                />
            </div>
            <PosOverallDiscount />
            <div className="p-4 bg-gray-50 border-t space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span> <span>{peso_value(cartDetail.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Total Discount</span> <span>{peso_value(total_total_discount)}</span>
                </div>
                <div className="flex justify-between text-xl font-black border-t pt-2">
                    <span>Total</span> <span>{peso_value(cartDetail.grandTotal - (total_total_discount || 0))}</span>
                </div>
                <div className="flex gap-2 pt-2">
                    <button
                        onClick={() => {
                            dispatch(setCart([]));
                            dispatch(setAmountPaid(0));
                        }}
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