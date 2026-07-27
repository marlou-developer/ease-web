import React, { useEffect } from 'react'
import Layout from "../../layout";
import SalesTableSection from './_sections/sales-table-section';
import loadingApi from '@/app/lib/loading-api';
import store from '@/app/store/store';
import { get_pos_product_stocks_thunk, get_pos_sales_by_id_thunk } from '@/app/redux/pos/pos-thunk';
import BillingSection from './_sections/billing-section';
import SalesHeaderSection from './_sections/sales-header-section';

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_sales_by_id_thunk(window.location.pathname.split('/')[4])))
        store.dispatch(get_pos_product_stocks_thunk())
    }, [])
    return (
        <Layout>
            <div className='flex flex-col gap-3 p-5'>
                <SalesHeaderSection />
                <SalesTableSection />
                <BillingSection />
            </div>
        </Layout>
    )
}
