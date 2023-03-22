import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/service/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        findAll() {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "findAll", requestOptions);
        },
        findAvailableServicesToAdd(station_id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "findAvailableServicesToAdd/"+station_id, requestOptions);
        },
        addService(label, price, duration) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.post(baseUrl + "add",{"label": label,"price": price, "duration": duration}, requestOptions);
        },
        updateService(id,label, price, duration) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.put(baseUrl + "update/"+id,{"label": label,"price": price, "duration": duration}, requestOptions);

        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.delete(baseUrl + "delete/"+id, requestOptions);
        }

}