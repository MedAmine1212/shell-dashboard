import axios from "axios";
const baseUrl = "http://localhost:8000/api/vehicle/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        findAllByClient(id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAllByClientId/"+id,requestOptions);
        },
        add(clientId,matricule, brand, model, year, mileage, fuelType, lastOilChange) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"add/"+clientId,{"matricule":matricule,"brand": brand,"model": model,"year": year,"fuelType": fuelType, "mileage": mileage, "lastOilChange": lastOilChange},requestOptions);
        },
        update(vehicle_id,matricule, brand, model, year, mileage, fuelType, lastOilChange) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"update/"+vehicle_id,{"matricule":matricule,"brand": brand,"model": model,"year": year,"fuelType": fuelType, "mileage": mileage, "lastOilChange": lastOilChange},requestOptions);
        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.delete(baseUrl+"delete/"+id,requestOptions);
        }


}