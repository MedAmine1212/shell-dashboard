import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/borne/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        getAllByStationId(station_id) {

            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAllByStationId/"+station_id,requestOptions);
        },
        addBorne(station_id, minutes) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"add/"+station_id,{'heartBeatInterval': minutes}, requestOptions);
        },
    updateInterval(borne_id, minutes) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.post(baseUrl+"changeInterval/"+borne_id,{'heartBeatInterval': minutes}, requestOptions);
    },
    deleteBorne(borne_id) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.delete(baseUrl+"delete/"+borne_id, requestOptions);
    }
}