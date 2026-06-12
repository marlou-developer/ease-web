export async function get_pos_reports_service(data) {
    return (await axios.get(`/api/pos-reports${window.location.search}`)).data;
}
