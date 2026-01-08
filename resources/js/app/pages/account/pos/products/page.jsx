import React, { useEffect, useState } from "react";
import Layout from "../layout";
import ProductHeaderSection from "./_sections/product-header-section";
import ProductSearchSection from "./_sections/product-search-section";
import ProductTableSection from "./_sections/product-table-section";
import ProductPaginationSection from "./_sections/product-pagination-section";
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
            <div className=" bg-slate-100 font-sans text-slate-700">
                <div className=" bg-white  overflow-hidden">
                    <ProductHeaderSection />
                    <ProductSearchSection />
                    {!loading && <>
                    <ProductTableSection />
                    <ProductPaginationSection />
                    </>}
                </div>
            </div>
        </Layout>
    );
}
