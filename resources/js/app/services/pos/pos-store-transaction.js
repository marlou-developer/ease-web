export async function get_pos_store_transaction_service(data) {
    return (await axios.get("/api/pos-store-transaction")).data;
}
