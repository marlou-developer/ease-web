import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from "@/app/redux/pos/pos-slice";

export default function PosOverallDiscount() {
    const { cart } = useSelector((store) => store.pos);
    const dispatch = useDispatch();

    // Use local state to track what the user types in the input box
    const [discountInput, setDiscountInput] = useState("");

    function minus_discount_all_product(inputValue) {
        const total_carts = cart.length;
        if (total_carts === 0) return;

        // Convert input string to a clean number
        const totalDiscount = parseFloat(inputValue) || 0;

        // Evenly distribute the discount value
        const discountPerItem = totalDiscount / total_carts;

        const updatedCart = cart.map((item) => {
            return {
                ...item,
                // ✅ Fixed: Changed from 'price' to 'discount' to prevent data corruption
                // ✅ Fixed: Removed the Math.min constraint completely so totals can go negative
                discount: parseFloat(discountPerItem.toFixed(2))
            };
        });

        // 🚀 Dispatch the updated array back to Redux so the cart re-renders
        dispatch(setCart(updatedCart));
    }

    return (
        <div className='m-3'>
            <input
                type="text"
                inputMode="decimal"
                value={discountInput}
                placeholder='Overall Product Discount (Splits Evenly)'
                onChange={(e) => {
                    const val = e.target.value;

                    // Regex check to ensure they are only typing numbers/decimals
                    if (val === "" || /^\d*\.?\d*$/.test(val)) {
                        setDiscountInput(val);
                        minus_discount_all_product(val);
                    }
                }}
                onBlur={() => {
                    // Clean up trailing decimals on blur (e.g. "50." becomes "50")
                    const cleaned = parseFloat(discountInput) || 0;
                    setDiscountInput(cleaned === 0 ? "" : cleaned.toString());
                }}
                className="w-full p-3 border rounded text-sm font-bold text-left outline-none focus:border-blue-500"
            />
        </div>
    );
}