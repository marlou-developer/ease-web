import { get_user_service } from "../services/app-service";
import { appSlice } from "./app-slice";

export function get_user_thunk() {
    return async function (dispatch, getState) {
        const res = await get_user_service();
        dispatch(appSlice.actions.setApp(res.data));
    };
}
