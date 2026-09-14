import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { updateStoreStockQuantities, setSales } from "@/app/redux/pos/pos-slice";
import store from "@/app/store/store";

// Subscribes to the current POS store's realtime channel so stock levels and
// new sales update live across every connected cashier/inventory screen.
export default function usePosRealtime() {
    const { pos_store_id } = usePage().props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!pos_store_id || !window.Echo) return;

        const channel = window.Echo.channel(`pos-store.${pos_store_id}`);

        channel.listen(".stock.updated", (event) => {
            dispatch(updateStoreStockQuantities(event.stocks));
        });

        channel.listen(".sale.created", (event) => {
            const { sales = [] } = store.getState().pos;
            dispatch(setSales([event.sale, ...sales]));
        });

        return () => {
            window.Echo.leave(`pos-store.${pos_store_id}`);
        };
    }, [pos_store_id, dispatch]);
}
