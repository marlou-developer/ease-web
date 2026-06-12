export async function get_pos_users_service(data) {
    return (await axios.get("/api/get_pos_users")).data;
}
