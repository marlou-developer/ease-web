export async function get_pos_customer_service() {
    return (await axios.get("/api/pos-customers")).data;
}

export async function create_pos_customer_service(data) {
    return await axios.post("/api/pos-customers", data);
}
