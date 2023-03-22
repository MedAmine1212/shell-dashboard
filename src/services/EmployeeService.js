import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/employee/";
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
        getAllUnassigned() {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"getAllUnassigned",requestOptions);
        },
        add(firstName, lastName, phone, email, barCode) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"add",{'firstName': firstName, 'lastName': lastName, 'phone':phone,'email': email, 'barCode':barCode}, requestOptions);
        },
        assignToStation(user_id,station_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"assignToStation/"+user_id+"/"+station_id,requestOptions);
        },
        unassignFromStation(user_id,station_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"unassignFromStation/"+user_id+"/"+station_id,requestOptions);
        }

}