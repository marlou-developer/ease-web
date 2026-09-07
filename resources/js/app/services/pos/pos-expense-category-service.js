import axios from "axios";

export async function get_pos_expense_categories_service() {
    return (await axios.get("/api/pos-expense-categories")).data;
}

export async function add_pos_expense_category_service(data) {
    return (await axios.post("/api/pos-expense-categories", data)).data;
}

export async function update_pos_expense_category_service(id, data) {
    return (await axios.put(`/api/pos-expense-categories/${id}`, data)).data;
}

export async function delete_pos_expense_category_service(id) {
    return (await axios.delete(`/api/pos-expense-categories/${id}`)).data;
}
