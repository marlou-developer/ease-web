import loadingApi from "@/app/lib/loading-api";
import Layout from "@/app/pages/account/pos/layout";
import { get_pos_store_requests_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import React, { useEffect } from "react";
import RequestsTableSection from "./_sections/requests-table-section";

export default function page() {


    useEffect(() => {
        loadingApi(store.dispatch(get_pos_store_requests_thunk()))
    }, [])
    return (
        <Layout>
            <div className="p-3 flex flex-col gap-3">
                <RequestsTableSection />
            </div>
        </Layout>
    );
}
