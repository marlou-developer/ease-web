import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import store from "@/app/store/store";
import { get_pos_sales_by_id_thunk } from "@/app/redux/pos/pos-thunk";
import POSProductListSection from "../../../pos/_sections/pos-product-list-section";
import POSSelectedProductSection from "./pos-selected-product-section";
import POSCheckout from "./pos-checkout-section";
import { setCart } from "@/app/redux/pos/pos-slice";

// Passed 'item' as a prop so this component is reusable for any item
export default function AddProductSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                // Changed the hover color to red to indicate a destructive action
                variant="primary"
                outlined
            >
                <div className="flex gap-2 items-center justify-center">
                    <Plus size={18} /> Add Product
                </div>
            </Button>

            <Modal
                title=""
                width="max-w-7xl" // Reduced width to fit a simple confirmation message
                isOpen={open}
                onClose={() => {
                    dispatch(setCart([]));
                    setOpen(false)
                }}
            >

                <div className=" bg-gray-100  font-sans">
                    <div className=" grid grid-cols-12 gap-4 bg-white overflow-hidden border border-gray-200 h-[80vh]">
                        {/* LEFT: PRODUCTS (5 Columns) */}
                        <POSProductListSection />

                        {/* MIDDLE: CART (5 Columns) */}
                        <section className="col-span-12  lg:col-span-5 border flex flex-col overflow-auto">
                            <POSSelectedProductSection />
                        </section>

                        {/* RIGHT: PAYMENT & HELD (2 Columns) */}
                        <section className="col-span-12 lg:col-span-3 p-4 flex flex-col bg-gray-50">
                            <POSCheckout setOpen={setOpen}/>
                        </section>
                    </div>
                </div>
            </Modal>
        </>
    );
}