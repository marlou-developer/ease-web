import Table from "@/app/_components/table";
import peso_value from "@/app/lib/peso-value";
import React from "react";
import { useSelector } from "react-redux";
import { Edit2 } from "lucide-react"; // Imported for the edit icon

export default function BillingSection() {
    const { sale } = useSelector((store) => store.pos);

    // --- Calculations for the Summary Section ---
    const subtotalPrice = sale?.sale_items?.reduce((acc, item) => {
        return acc + (Number(item.selling_price || item.discounted_price) * item.quantity);
    }, 0) || 0;

    const totalDiscountPerItem = sale?.sale_items?.reduce((acc, item) => {
        return acc + Number(item.discount || 0);
    }, 0) || 0;

    const customerTotalDiscount = 0; // Replace with actual customer discount field if available
    const totalDiscountPerOrder = Number(sale?.discount || 0);
    const overallTotalDiscount = customerTotalDiscount + totalDiscountPerItem + totalDiscountPerOrder;

    const grandTotal = subtotalPrice - overallTotalDiscount;


    console.log('salesale', sale)

    return (
        <div className="flex flex-col w-full">

            {/* Billing Summary Section */}
            <div className="flex justify-end mt-10 mb-8 pr-4">
                <div className="w-full max-w-md space-y-3 text-sm text-gray-800">

                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600">Bill To:</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">
                                {sale?.customer?.name || `N/A`}
                            </span>
                            <button className="text-blue-500 hover:text-blue-700 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Cashier:</span>
                        <span className="font-medium">{sale?.cashier?.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Payment Status:</span>
                        <span className="font-medium">{sale?.status}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Subtotal Price:</span>
                        <span className="font-medium">{peso_value(subtotalPrice)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Customer Total Discount:</span>
                        <span className="font-medium">{peso_value(customerTotalDiscount)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span>Total Discount Per Item:</span>
                        <span className="font-medium">{peso_value(totalDiscountPerItem)}</span>
                    </div>

                    {/* <div className="flex justify-between items-center">
                        <span>Total Discount Per Order:</span>
                        <span className="font-medium">{peso_value(totalDiscountPerOrder)}</span>
                    </div> */}

                    {/* <div className="flex justify-between items-center">
                        <span>Overall Total Discount Price:</span>
                        <span className="font-medium">{peso_value(overallTotalDiscount)}</span>
                    </div> */}

                    <hr className="my-4 border-gray-200" />

                    <div className="flex justify-between items-center text-base font-bold text-black mt-2">
                        <span>Total:</span>
                        <span>{peso_value(grandTotal)}</span>
                    </div>

                </div>
            </div>
        </div>
    );
}