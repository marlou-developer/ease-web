import {
    get_pos_suppliers_service,
} from "@/app/services/pos-supplier-service";
import { posSlice } from "./pos-slice";
import { get_pos_purchases_service } from "@/app/services/pos-purchases-service";

export function get_pos_suppliers_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_suppliers_service();
        dispatch(posSlice.actions.setSuppliers(res.data));
    };
}

export function get_pos_purchases_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_purchases_service();
        dispatch(posSlice.actions.setPurchases(res?.purchases));
        dispatch(posSlice.actions.setSuppliers(res?.suppliers));
        dispatch(posSlice.actions.setProducts(res?.products));
    };
}
