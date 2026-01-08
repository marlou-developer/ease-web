import { get_pos_product_service } from "@/app/services/pos-product-service";
import { posProductSlice } from "./pos-product-slice";
import { get_pos_product_stocks_service } from "@/app/services/pos-product-stock";


export function get_pos_products_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_product_service();
        dispatch(posProductSlice.actions.setProducts(res.data));
    };
}


export function get_pos_product_stocks_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_product_stocks_service();
        dispatch(posProductSlice.actions.setProducts(res.data));
    };
}