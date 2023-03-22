import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/station/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        findById(station_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findById/"+station_id,requestOptions);
        },
        findAll() {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAll",requestOptions)
        },
        deleteStation(station_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.delete(baseUrl+"delete/"+station_id,requestOptions)
        },
        addStation(stationName, stationAddress) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"add",{"label": stationName, "address": stationAddress},requestOptions)
        },
        updateStation(stationId, station) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.put(baseUrl+"update/"+stationId,{"label": station.label, "address": station.address},requestOptions)
        }

}