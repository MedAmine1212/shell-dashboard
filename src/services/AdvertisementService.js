import axios from "axios";
    const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/advertisement/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        addAdvertisement(formData) {
            requestOptions.headers.Authorization = "Bearer " + auth.actions.getToken();
            requestOptions.headers["Content-Type"] = "multipart/form-data";
            return axios.post(baseUrl + "createNewAdd",formData, requestOptions);
        },
        getAllAds() {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAll",requestOptions);
        },
        addAdToBorne(ad_id, borne_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"addAdToBorne/"+ad_id+"/"+borne_id,requestOptions);
        },
        removeAdFromBorne(ad_id, borne_id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"removeAdFromBorne/"+ad_id+"/"+borne_id,requestOptions);
        },
        findAllByBorneId(id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAllByBorneId/"+id,requestOptions);
        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.delete(baseUrl+"delete/"+id,requestOptions);
        }
}