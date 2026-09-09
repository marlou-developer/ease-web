import axios from "axios";

export async function create_pos_product_stocks_service(data) {
    return await axios.post("/api/pos-product-stocks", data);
}

export async function received_pos_product_stocks_service(data) {
    return await axios.post("/api/pos-product-stocks-received", data);
}



export async function get_pos_product_stocks_service(data) {
    return (await axios.get("/api/pos-product-stocks")).data;
}

export async function delete_pos_product_stocks_service(id) {
    return (await axios.delete(`/api/pos-product-stocks/${id}`)).data;
}

export async function get_removed_pos_product_stocks_service() {
    return (await axios.get("/api/pos-product-stocks-removed")).data;
}

export async function restore_pos_product_stocks_service(id) {
    return (await axios.post(`/api/pos-product-stocks-restore/${id}`)).data;
}
