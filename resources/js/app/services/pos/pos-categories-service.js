import axios from "axios";

export async function create_pos_category_service(data) {
    return await axios.post("/api/pos-categories", data);
}
