import loadingApi from "@/app/lib/loading-api";
import Layout from "@/app/pages/account/pos/layout";
import { get_pos_store_transaction_thunk } from "@/app/redux/pos/pos-thunk";
import store from "@/app/store/store";
import React, { useEffect } from "react";
import TransactionTableSection from "./_sections/transaction-table-section";

export default function page() {


    useEffect(()=>{
        loadingApi(store.dispatch(get_pos_store_transaction_thunk()))
    },[])
  
    return (
        <Layout>
            <TransactionTableSection />
        </Layout>
    );
}
