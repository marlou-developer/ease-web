import axios from "axios";

export async function create_pos_product_stocks_product_service(data) {
    return await axios.post("/api/pos-product-stocks", data);
}

export async function edit_pos_product_stocks_product_service(id, data) {
    return await axios.put(`/api/pos-product-stocks/${id}`, data);
}

export async function create_pos_product_service(data) {
    return await axios.post("/api/pos-products", data);
}

export async function get_pos_product_service(data) {
    return await axios.get("/api/pos-products");
}
