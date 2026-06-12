import React, { useEffect } from 'react'
import Layout from '../layout'
import ReportsTableSection from './_sections/reports-table-section'
import ReportsHeaderSection from './_sections/reports-header-section'
import ReportsSearchSection from './_sections/reports-search-section'
import ReportsCardSection from './_sections/reports-card-section'
import loadingApi from '@/app/lib/loading-api'
import store from '@/app/store/store'
import { get_pos_reports_thunk } from '@/app/redux/pos/pos-thunk'

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_reports_thunk()))
    }, [window.location.search])
    return (
        <Layout>
            <ReportsHeaderSection />
            <div className="space-y-6  p-4 ">
                <ReportsCardSection />
                <ReportsSearchSection />
                <ReportsTableSection />
            </div>
        </Layout>
    )
}
