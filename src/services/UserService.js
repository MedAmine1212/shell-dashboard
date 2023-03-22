import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/user/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    delete(id) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.delete(baseUrl+"delete/"+id,requestOptions);
    },
    update(user) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.put(baseUrl+"update/"+user.id,{'firstName':user.firstName,'lastName':user.lastName,'email':user.email,'phone':user.phone},requestOptions);
    },

}