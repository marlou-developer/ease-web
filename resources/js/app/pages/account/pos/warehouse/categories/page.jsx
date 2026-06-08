import Layout from "@/app/pages/account/pos/layout";
import React from "react";
import CategoriesTableSection from "./sections/categories-table-section";
import CategoryHeaderSection from "./sections/category-header-section";
import CategoryPaginationSection from "./sections/category-pagination-section";

export default function page() {
    return (
        <Layout>
            <CategoryHeaderSection />
            <CategoriesTableSection />
            <CategoryPaginationSection />
        </Layout>
    );
}
