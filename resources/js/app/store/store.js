import { configureStore } from "@reduxjs/toolkit";
import appSlice from "../redux/app-slice";
import posProductSlice  from "../redux/pos/pos-product-slice";
import  posStockMovementSlice  from "../redux/pos/pos-stock-movement-slice";
const store = configureStore({
    reducer: {
        app: appSlice,
        pos_products:posProductSlice,
        pos_stock_movements:posStockMovementSlice
    },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;

export default store;
