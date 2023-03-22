import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/station_service/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        removeServiceFromStation(station_service) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "removeServiceFromStation/"+station_service.service_id+"/"+station_service.station_id, requestOptions);
        },
        addServiceToStation(service_id, station_id, price) {
                requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
                return axios.post(baseUrl + "addServiceToStation/"+service_id+"/"+station_id,{"price": price}, requestOptions);
        },

}