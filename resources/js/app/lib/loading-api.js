import { setLoading } from "../redux/app-slice";
import store from "@/app/store/store"; // Make sure this path points to your Redux store!

export default async function loadingApi(apiPromise) {
    store.dispatch(setLoading(true));
    try {
        await apiPromise;
    } catch (error) {
        console.error("API Error:", error);
    } finally {
        store.dispatch(setLoading(false));
    }
}
