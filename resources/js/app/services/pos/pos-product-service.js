import axios from "axios";

export async function create_pos_product_stocks_product_service(data) {
    return await axios.post("/api/pos-product-stocks", data);
}

export async function create_pos_product_service(data) {
    return await axios.post("/api/pos-products", data);
}


export async function get_pos_product_service(data) {
    return await axios.get("/api/pos-products");
}
