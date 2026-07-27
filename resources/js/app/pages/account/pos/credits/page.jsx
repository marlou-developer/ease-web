import React, { useEffect } from 'react'
import Layout from "../layout";
import HeaderSection from './_sections/header-section';
import SalesSearchSection from './_sections/sales-search-section';
import SalesTableSection from './_sections/sales-table-section';
import loadingApi from '@/app/lib/loading-api';
import store from '@/app/store/store';
import { get_pos_sales_thunk } from '@/app/redux/pos/pos-thunk';

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_sales_thunk()))
    }, [])
    return (
        <Layout>
            <HeaderSection />
            <SalesSearchSection />
            <SalesTableSection />
        </Layout>
    )
}
