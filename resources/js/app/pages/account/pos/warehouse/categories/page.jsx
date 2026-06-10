import Layout from "@/app/pages/account/pos/layout";
import React, { useEffect } from "react";
import CategoriesTableSection from "./sections/categories-table-section";
import CategoryHeaderSection from "./sections/category-header-section";
import CategoryPaginationSection from "./sections/category-pagination-section";
import loadingApi from "@/app/lib/loading-api";
import store from "@/app/store/store";
import { get_pos_category_thunk } from "@/app/redux/pos/pos-thunk";

export default function page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_category_thunk()))
    }, [])
    return (
        <Layout>
            <CategoryHeaderSection />
            <CategoriesTableSection />
            <CategoryPaginationSection />
        </Layout>
    );
}
