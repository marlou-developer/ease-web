import axios from "axios";

export async function create_pos_product_service(data) {
    return await axios.post("/api/pos-products", data);
}
