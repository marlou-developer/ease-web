export async function create_pos_store_requests_service(data) {
    return await axios.post("/api/pos-store-requests", data);
}

export async function get_pos_store_requests_service() {
    return (await axios.get(`/api/pos-store-requests${window.location.search}`))
        .data;
}
