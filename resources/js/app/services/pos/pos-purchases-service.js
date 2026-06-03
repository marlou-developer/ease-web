export async function add_pos_purchases_service(data) {
    return await axios.post("/api/pos-purchases",data);
}


export async function get_pos_purchases_service(data) {
    return (await axios.get("/api/pos-purchases")).data;
}
