import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/consultation/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        fndAllByVehicle(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "findAllByVehicleId/" + id, requestOptions);
        },
        findAllByEmployee(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "findAllByEmployeeId/" + id, requestOptions);
        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.delete(baseUrl + "delete/"+id, requestOptions);
        }

}