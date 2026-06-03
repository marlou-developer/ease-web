import React, { useEffect } from 'react'
import Layout from '../layout'
import CustomersTableSection from './_sections/customers-table-section'
import HeaderSection from './_sections/header-section'
import TableFilterSection from './_sections/table-filter-section'
import store from '@/app/store/store'
import { get_pos_customer_thunk } from '@/app/redux/pos/pos-thunk'

export default function Page() {

    useEffect(()=>{
        store.dispatch(get_pos_customer_thunk())
    },[])
    return (
        <Layout>
            <HeaderSection />
            <TableFilterSection />
            <CustomersTableSection />
        </Layout>
    )
}
