export async function get_user_service(data) {
    return await axios.get("/api/user");
}

export async function add_user_service(data) {
    return await axios.post("/api/user",data);
}

export async function update_user_service(id, data) {
    return await axios.put(`/api/user/${id}`, data);
}

export async function delete_user_service(id) {
    return await axios.delete(`/api/user/${id}`);
}

export async function toggle_user_lock_service(id) {
    return await axios.patch(`/api/user/${id}/toggle-lock`);
}


export async function change_store_service(data) {
    return await axios.put(`/api/pos-store/${data.pos_store_id}`, data);
}

export async function get_user_login_logs_service(userId, page = 1) {
    return await axios.get(`/api/user-login-logs/${userId}`, { params: { page } });
}
