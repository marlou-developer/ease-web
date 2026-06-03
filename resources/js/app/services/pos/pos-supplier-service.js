export async function add_pos_suppliers_service(data) {
    return await axios.post("/api/pos-suppliers",data);
}


export async function get_pos_suppliers_service(data) {
    return (await axios.get("/api/pos-suppliers")).data;
}
