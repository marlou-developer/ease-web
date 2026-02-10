import { get_pos_stock_movements_service } from "@/app/services/pos-stock-movement-service";
import { posStockMovementSlice } from "./pos-stock-movement-slice";

export function get_pos_stock_movements_thunk() {
    return async function (dispatch, getState) {
        const res = await get_pos_stock_movements_service();
        dispatch(posStockMovementSlice.actions.setStockMovements(res.data));
        dispatch(posStockMovementSlice.actions.setStats(res.data.stats));
    };
}
