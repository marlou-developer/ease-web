import { get_pos_suppliers_service } from "@/app/services/pos/pos-supplier-service";
import { posSlice } from "./pos-slice";
import { get_pos_purchases_service } from "@/app/services/pos/pos-purchases-service";
import { get_pos_warehouse_stock_service } from "@/app/services/pos/pos-warehouse-service";
import { get_pos_customer_service } from "@/app/services/pos/pos-customer-service";
import { get_pos_product_stocks_service } from "@/app/services/pos/pos-product-stock";
import { get_pos_sales_service } from "@/app/services/pos/pos-sales-service";
import { get_pos_category_service } from "@/app/services/pos/pos-categories-service";
import { get_pos_users_service } from "@/app/services/index/users-service";
import { get_pos_reports_service } from "@/app/services/pos/pos-report-service";
import { get_pos_warehouse_transaction_service } from "@/app/services/pos/pos-warehouse-transaction";
import { get_pos_store_transaction_service } from "@/app/services/pos/pos-store-transaction";
import { get_pos_store_requests_service } from "@/app/services/pos/pos-store-requests-service";

export function get_pos_suppliers_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));
        const res = await get_pos_suppliers_service();
        dispatch(posSlice.actions.setSuppliers(res.data));
    };
}

export function get_pos_store_requests_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));
        const res = await get_pos_store_requests_service();
        dispatch(posSlice.actions.setProducts(res.warehouse_products));
        dispatch(posSlice.actions.setProductRequests(res.requests));
    };
}

export function get_pos_purchases_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_purchases_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setPurchases(res?.purchases));
        dispatch(posSlice.actions.setSuppliers(res?.suppliers));
        dispatch(posSlice.actions.setCategories(res?.categories));
        dispatch(posSlice.actions.setPurchasesProducts(res?.products));
    };
}

export function get_pos_warehouse_stock_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_warehouse_stock_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setProducts(res.data));
        dispatch(posSlice.actions.setUnits(res.units));
        dispatch(posSlice.actions.setSuppliers(res.suppliers));
        dispatch(posSlice.actions.setCategories(res.categories));
        dispatch(posSlice.actions.setCountPendingStocks(res.count_pending_stocks));
    };
}

export function get_pos_customer_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));

        const res = await get_pos_customer_service();
        dispatch(posSlice.actions.setCustomers(res.data));
    };
}

export function get_pos_category_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));
        const res = await get_pos_category_service();
        dispatch(posSlice.actions.setCategories(res.data));
    };
}

export function get_pos_product_stocks_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_product_stocks_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setStoreStocks(res.pos_product_stock));
        dispatch(posSlice.actions.setCustomers(res.customers));
        dispatch(posSlice.actions.setProducts(res.warehouse_products));
        dispatch(posSlice.actions.setCountProcessingStocks(res.count_processing_stocks));
        
    };
}

export function get_pos_sales_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_sales_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setSales(res.data));
    };
}

export function get_pos_reports_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_reports_service();
        dispatch(posSlice.actions.setReports(res.data));
    };
}

export function get_pos_users_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_users_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setUsers(res.data));
    };
}

export function get_pos_warehouse_transaction_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_warehouse_transaction_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setWarehouseStats(res.stats));
        dispatch(posSlice.actions.setSuppliers(res.suppliers));
        dispatch(posSlice.actions.setPosWarehouseTransactions(res.data));
        dispatch(posSlice.actions.setStoreStocks(res.stocks));
    };
}

export function get_pos_store_transaction_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_store_transaction_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setStoreStocks(res.stocks));
        dispatch(posSlice.actions.setSuppliers(res.suppliers));
        dispatch(posSlice.actions.setPosStoreTransactions(res.data));
        dispatch(posSlice.actions.setPosStoreStats(res.stats));
    };
}
