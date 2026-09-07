import axios from "axios";

export async function get_pos_expenses_service() {
    return (await axios.get("/api/pos-expenses")).data;
}

export async function add_pos_expense_service(data) {
    return (await axios.post("/api/pos-expenses", data)).data;
}

export async function update_pos_expense_service(id, data) {
    return (await axios.put(`/api/pos-expenses/${id}`, data)).data;
}

export async function delete_pos_expense_service(id) {
    return (await axios.delete(`/api/pos-expenses/${id}`)).data;
}
