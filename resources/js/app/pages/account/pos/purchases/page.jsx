import React, { useEffect } from 'react'
import Layout from '../layout'
import PurchaseTableSection from './_sections/purchases-table-section'
import store from '@/app/store/store'
import { get_pos_purchases_thunk } from '@/app/redux/pos/pos-thunk'

export default function Page() {

    useEffect(() => {
        store.dispatch(get_pos_purchases_thunk())
    }, [])
    return (
        <Layout>
            <PurchaseTableSection />
        </Layout>
    )
}
