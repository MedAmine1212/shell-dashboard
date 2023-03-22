import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/product/";
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
        findAvailableProductsToAdd(station_id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "findAvailableProductsToAdd/"+station_id, requestOptions);
        },
        addProduct(formData) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            requestOptions.headers["Content-Type"] = "multipart/form-data";
            return axios.post(baseUrl + "add",formData, requestOptions);
        },
        update(id, formData) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            requestOptions.headers["Content-Type"] = "multipart/form-data";
            return axios.post(baseUrl + "update/"+id,formData, requestOptions);
        },
        getImageByProductId(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.get(baseUrl + "getImageByProductId/"+id, requestOptions);
        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            return axios.delete(baseUrl + "delete/"+id, requestOptions);
        }


}