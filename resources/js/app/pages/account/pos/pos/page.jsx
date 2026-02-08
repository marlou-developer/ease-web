import React, { useEffect, useState } from "react";
import Layout from "../layout";
import POSCheckout from "./_sections/pos-checkout-section";
import POSProductListSection from "./_sections/pos-product-list-section";
import POSSelectedProductSection from "./_sections/pos-selected-product-section";
import store from "@/app/store/store";
import { get_pos_product_stocks_thunk } from "@/app/redux/pos/pos-product-thunk";

export default function Page() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function get_data(params) {
            try {
                await store.dispatch(get_pos_product_stocks_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, []);
    return (
        <Layout>
            <div className=" bg-gray-100  font-sans">
                <div className=" grid grid-cols-12 gap-4 bg-white overflow-hidden border border-gray-200 h-[90vh]">
                    {/* LEFT: PRODUCTS (5 Columns) */}
                    <POSProductListSection />

                    {/* MIDDLE: CART (5 Columns) */}
                    <section className="col-span-12  lg:col-span-5 border flex flex-col overflow-auto">
                        <POSSelectedProductSection />
                    </section>

                    {/* RIGHT: PAYMENT & HELD (2 Columns) */}
                    <section className="col-span-12 lg:col-span-3 p-4 flex flex-col bg-gray-50">
                        <POSCheckout />
                    </section>
                </div>
            </div>
        </Layout>
    );
}
