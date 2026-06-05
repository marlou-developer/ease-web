import { get_pos_suppliers_service } from "@/app/services/pos/pos-supplier-service";
import { posSlice } from "./pos-slice";
import { get_pos_purchases_service } from "@/app/services/pos/pos-purchases-service";
import { get_pos_warehouse_stock_service } from "@/app/services/pos/pos-warehouse-service";
import { get_pos_customer_service } from "@/app/services/pos/pos-customer-service";
import { get_pos_product_stocks_service } from "@/app/services/pos/pos-product-stock";

export function get_pos_suppliers_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setLoading(true));
        const res = await get_pos_suppliers_service();
        dispatch(posSlice.actions.setSuppliers(res.data));
        dispatch(posSlice.actions.setLoading(false));
    };
}

export function get_pos_purchases_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setLoading(true));
        const res = await get_pos_purchases_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setPurchases(res?.purchases));
        dispatch(posSlice.actions.setSuppliers(res?.suppliers));
        dispatch(posSlice.actions.setProducts(res?.products));
        dispatch(posSlice.actions.setLoading(false));
    };
}

export function get_pos_warehouse_stock_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setLoading(true));
        const res = await get_pos_warehouse_stock_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setProducts(res.data));
        dispatch(posSlice.actions.setLoading(false));
    };
}

export function get_pos_customer_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setLoading(true));
        const res = await get_pos_customer_service();
        dispatch(posSlice.actions.setCustomers(res.data));
        dispatch(posSlice.actions.setLoading(false));
    };
}

export function get_pos_product_stocks_thunk() {
    return async function (dispatch, getState) {
        dispatch(posSlice.actions.setLoading(true));
        const res = await get_pos_product_stocks_service();
        dispatch(posSlice.actions.setSearchTerm(""));
        dispatch(posSlice.actions.setStoreStocks(res.data));
        dispatch(posSlice.actions.setLoading(false));
    };
}
