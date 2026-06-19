import React, { useEffect } from 'react'
import Layout from '../layout'
import HeaderSection from './_sections/header-section'
import WarehouseTableSection from './_sections/warehouse-table-section'
import WarehouseSearchSection from './_sections/warehouse-search-section'
import store from '@/app/store/store'
import { get_pos_warehouse_stock_thunk } from '@/app/redux/pos/pos-thunk'
import WarehousePaginationSection from './_sections/product-pagination-section'
import loadingApi from '@/app/lib/loading-api'

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_warehouse_stock_thunk()))
    }, [])

    return (
        <Layout>
            <HeaderSection />
            <WarehouseSearchSection />
            <WarehouseTableSection />
            <WarehousePaginationSection />
        </Layout>
    )
}
