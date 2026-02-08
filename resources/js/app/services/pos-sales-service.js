import axios from "axios";

export async function create_pos_sales_service(data) {
    return await axios.post("/api/pos-sales", data);
}
