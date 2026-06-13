export async function get_user_service(data) {
    return await axios.get("/api/user");
}

export async function add_user_service(data) {
    return await axios.post("/api/user",data);
}


export async function change_store_service(data) {
    return await axios.put(`/api/pos-store/${data.pos_store_id}`, data);
}
