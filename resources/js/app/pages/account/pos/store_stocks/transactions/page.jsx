import loadingApi from "@/app/lib/loading-api";
import Layout from "@/app/pages/account/pos/layout";
import { get_pos_store_transaction_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import React, { useEffect } from "react";
import TransactionTableSection from "./_sections/transaction-table-section";
import TransactionSearchSection from "./_sections/transaction-search-section";
import TransactionHeaderSection from "./_sections/transaction-header-section";
import TransactionStatsSection from "./_sections/transaction-stats-section";

export default function page() {


    useEffect(() => {
        loadingApi(store.dispatch(get_pos_store_transaction_thunk()))
    }, [])

    return (
        <Layout>
            <div className="p-3 flex flex-col gap-3">
                <TransactionHeaderSection />
                <TransactionSearchSection />
                <TransactionStatsSection />
                <TransactionTableSection />
            </div>
        </Layout>
    );
}
