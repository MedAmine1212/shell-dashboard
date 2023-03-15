import axios from "axios";
const baseUrl = "http://localhost:8000/api/stationAdmin/";
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
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAll",requestOptions);
        },
        add(firstName, lastName, phone, email, password) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"add/",{'firstName': firstName, 'lastName': lastName, 'phone':phone,'email': email, 'password':password}, requestOptions);
        },
        getStationAdminsWithNoStation() {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"getStationAdminsWithNoStation/", requestOptions);
        },
    assignStationAdmin(admin_id,station_id) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.get(baseUrl+"assignStationAdmin/"+admin_id+"/"+station_id, requestOptions);

    }

}