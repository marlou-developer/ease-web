import loadingApi from "@/app/lib/loading-api";
import Layout from "@/app/pages/account/pos/layout";
import { get_removed_pos_product_stocks_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import React, { useEffect } from "react";
import RemovedHeaderSection from "./_sections/removed-header-section";
import RemovedTableSection from "./_sections/removed-table-section";

export default function Page() {
    useEffect(() => {
        loadingApi(store.dispatch(get_removed_pos_product_stocks_thunk()));
    }, []);

    return (
        <Layout>
            <div className="bg-slate-100 font-sans text-slate-700">
                <div className="bg-white overflow-hidden">
                    <RemovedHeaderSection />
                    <RemovedTableSection />
                </div>
            </div>
        </Layout>
    );
}
