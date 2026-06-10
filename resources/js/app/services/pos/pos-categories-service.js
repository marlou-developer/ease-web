import axios from "axios";

export async function create_pos_category_service(data) {
    return await axios.post("/api/pos-categories", data);
}

export async function get_pos_category_service(data) {
    return await axios.get("/api/pos-categories", data);
}

export async function edit_pos_category_service(data) {
    return await axios.get(`/api/pos-categories/${data.id}`, data);
}
