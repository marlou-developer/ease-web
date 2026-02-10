import axios from "axios";

export async function get_pos_stock_movements_service() {
    return await axios.get("/api/pos-stock-movements");
}
