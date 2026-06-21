export async function get_pos_warehouse_transaction_service(data) {
    return (await axios.get(`/api/pos-warehouse-transaction${window.location.search}`)).data;
}
