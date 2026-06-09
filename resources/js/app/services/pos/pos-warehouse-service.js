export async function get_pos_warehouse_stock_service(data) {
    return (await axios.get("/api/pos-warehouse-stock")).data;
}

export async function edit_pos_warehouse_stocks_product_service(id, data) {
    return await axios.put(`/api/pos-warehouse-stock/${id}`, data);
}


export async function add_new_stock_in_store_service(data) {
    return await axios.post("/api/add_new_stock_in_store",data);
}

