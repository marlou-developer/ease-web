import React, { useEffect } from "react";
import Layout from "../layout";
import StockMovementTableSection from "./_section/stock-movement-table-section";
import store from "@/app/store/store";
import { get_pos_stock_movements_thunk } from "@/app/redux/pos/pos-stock-movement-thunk";
import StockMovementCardSection from "./_section/stock-movement-card-section";
import StockMovementHeaderSection from "./_section/stock-movement-header-section";
import StockMovementPaginationSection from "./_section/stock-movement-pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_pos_stock_movements_thunk());
    }, []);
    return (
        <Layout>
            <StockMovementHeaderSection />
            <StockMovementCardSection />
            <StockMovementTableSection />
            <StockMovementPaginationSection />
        </Layout>
    );
}
