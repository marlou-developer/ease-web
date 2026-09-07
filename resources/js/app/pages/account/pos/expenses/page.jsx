import React, { useEffect } from "react";
import Layout from "../layout";
import HeaderSection from "./_sections/header-section";
import ExpenseSearchSection from "./_sections/expense-search-section";
import store from "@/app/store/store";
import {
    get_pos_expense_categories_thunk,
    get_pos_expenses_thunk,
} from "@/app/redux/pos/pos-thunk";
import loadingApi from "@/app/lib/loading-api";
import ExpensesTableSection from "./_sections/expenses-table-section";

export default function page() {
    useEffect(() => {
        loadingApi(store.dispatch(get_pos_expenses_thunk()));
        loadingApi(store.dispatch(get_pos_expense_categories_thunk()));
    }, []);

    return (
        <Layout>
            <HeaderSection />
            <ExpenseSearchSection />
            <ExpensesTableSection />
        </Layout>
    );
}
