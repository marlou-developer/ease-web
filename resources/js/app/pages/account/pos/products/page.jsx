import React, { useEffect } from "react";
import Layout from "../layout";
import ProductHeaderSection from "./_sections/product-header-section";
import ProductSearchSection from "./_sections/product-search-section";
import ProductTableSection from "./_sections/product-table-section";
import ProductPaginationSection from "./_sections/product-pagination-section";

export default function Page() {

    useEffect(()=>{

    },[])
    return (
        <Layout>
            <div className=" bg-slate-100 font-sans text-slate-700">
                <div className=" bg-white  overflow-hidden">
                    <ProductHeaderSection />
                    <ProductSearchSection />
                    <ProductTableSection />
                    <ProductPaginationSection />
                </div>
            </div>
        </Layout>
    );
}
