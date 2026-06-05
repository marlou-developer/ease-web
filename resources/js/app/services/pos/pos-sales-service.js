import axios from "axios";

export async function create_pos_sales_service(data) {
    return await axios.post("/api/pos-sales", data);
}


export async function get_pos_sales_service(data) {
    return (await axios.get("/api/pos-sales")).data;
}
