import React, { useEffect } from 'react'
import Layout from '../layout'
import HeaderSection from './_sections/header-section'
import UsersTableSection from './_sections/users-table-section'
import loadingApi from '@/app/lib/loading-api'
import store from '@/app/store/store'
import { get_pos_users_thunk } from '@/app/redux/pos/pos-thunk'

export default function Page() {

    useEffect(() => {
        loadingApi(store.dispatch(get_pos_users_thunk()))
    }, [])

    return (
        <Layout>
            <HeaderSection />
            <UsersTableSection />
        </Layout>
    )
}
