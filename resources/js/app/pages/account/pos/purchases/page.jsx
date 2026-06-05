import React, { useEffect } from 'react'
import Layout from '../layout'
import PurchaseTableSection from './_sections/purchases-table-section'
import store from '@/app/store/store'
import { get_pos_purchases_thunk } from '@/app/redux/pos/pos-thunk'
import PurchasesSearchSection from './_sections/purchases-search-section'
import HeaderSection from './_sections/header-section'
import loadingApi from '@/app/lib/loading-api'

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_purchases_thunk()))
    }, [])
    return (
        <Layout>
            <HeaderSection />
            <PurchasesSearchSection />
            <PurchaseTableSection />
        </Layout>
    )
}
