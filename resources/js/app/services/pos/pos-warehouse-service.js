export async function get_pos_warehouse_stock_service(data) {
    return (await axios.get("/api/pos-warehouse-stock")).data;
}
