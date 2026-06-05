import React, { useEffect } from 'react'
import Layout from '../layout'
import CustomersTableSection from './_sections/customers-table-section'
import HeaderSection from './_sections/header-section'
import store from '@/app/store/store'
import { get_pos_customer_thunk } from '@/app/redux/pos/pos-thunk'
import CustomersSearchSection from './_sections/customers-search-section'
import CustomersPaginationSection from './_sections/customers-pagination-section'

export default function Page() {

    useEffect(()=>{
        store.dispatch(get_pos_customer_thunk())
    },[])
    return (
        <Layout>
            <HeaderSection />
            <CustomersSearchSection />
            <CustomersTableSection />
            <CustomersPaginationSection />
        </Layout>
    )
}
