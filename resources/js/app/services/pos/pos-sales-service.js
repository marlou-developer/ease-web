import axios from "axios";

export async function create_pos_sales_service(data) {
    return await axios.post("/api/pos-sales", data);
}

export async function add_sales_items_service(data) {
    return await axios.post("/api/add_sales_items", data);
}

export async function get_pos_sales_service(data) {
    return (
        await axios.get(
            `/api/pos-sales?is_credit=${window.location.pathname.split("/")[3] == "credits" ? 1 : 0}`,
        )
    ).data;
}

export async function get_pos_sales_by_id_service(id) {
    return (await axios.get(`/api/pos-sales/${id}`)).data;
}

export async function delete_pos_sales_item_service(data) {
    return (await axios.delete(`/api/pos-sale-items/${data.id}`, data)).data;
}

export async function update_discount_per_item_service(data) {
    return (await axios.post(`/api/update_discount_per_item_service`, data)).data;
}
