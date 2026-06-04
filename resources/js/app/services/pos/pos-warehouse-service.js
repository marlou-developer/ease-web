export async function get_pos_warehouse_stock_service(data) {
    return (await axios.get("/api/pos-warehouse-stock")).data;
}

export async function add_new_stock_in_store_service(data) {
    return await axios.post("/api/add_new_stock_in_store",data);
}

