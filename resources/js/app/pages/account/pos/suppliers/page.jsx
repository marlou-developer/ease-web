import React, { useEffect } from 'react'
import Layout from '../layout'
import SuppliersTableSection from './_sections/suppliers-table-section'
import store from '@/app/store/store'
import { get_pos_suppliers_thunk } from '@/app/redux/pos/pos-thunk'

export default function Page() {


    useEffect(() => {
        store.dispatch(get_pos_suppliers_thunk())
    }, [])
    return (
        <Layout>
            <SuppliersTableSection />
        </Layout>
    )
}
