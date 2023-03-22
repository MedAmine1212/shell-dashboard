import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/product_station/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
    addProductToStation(product_id, station_id, stock, price) {
        requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
        return axios.post(baseUrl + "addProductToStation/"+product_id+"/"+station_id, {"stock": stock, "price": price}, requestOptions);
    },
    removeProductFromStation(product_id, station_id, restore) {
        requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
        return axios.get(baseUrl + "removeProductFromStation/"+product_id+"/"+station_id+"/"+restore, requestOptions);
    }
}