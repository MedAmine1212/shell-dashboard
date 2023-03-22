import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/client/";
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
            return axios.get(baseUrl+"findAllClients",requestOptions);
        },
    validateClient(id, barCode){
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.get(baseUrl+"validateClient/"+id+"/"+barCode,requestOptions);
    },
    add(firstName, lastName, phone, email) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.post(baseUrl+"addClient",{'firstName': firstName, 'lastName': lastName, 'phone':phone,'email': email}, requestOptions);

    }


}