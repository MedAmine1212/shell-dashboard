import axios from "axios";
const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/workSchedule/";
import auth from './../services/auth.js'
const requestOptions = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': ""
    }
};
export default {
        addWorkSchedule(workSchedule) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.post(baseUrl+"create",{'minimumConsultationTime': workSchedule.minimumConsultationTime,'days':workSchedule.working_days },requestOptions);
        },
        updateMinimumConsultationTime(id, minimumConsultationTime) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.put(baseUrl+"update/"+id,{'minimumConsultationTime': minimumConsultationTime},requestOptions);
        },
        delete(id) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.delete(baseUrl+"delete/"+id,requestOptions);
        },
        findAll() {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.get(baseUrl+"findAll",requestOptions);
        },
        changeWorkingStatus(id ,status) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.put(baseUrl+"updateWorkingDay/"+id,{'working': status}, requestOptions);
        },
        changePauseStatus(id ,status) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.put(baseUrl+"updateWorkingDay/"+id,{'pause': status}, requestOptions);
        },
        updateWorkingDay(id ,day) {
            requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
            return axios.put(baseUrl+"updateWorkingDay/"+id,{'shiftStart': day.shiftStart,'shiftEnd':  day.shiftEnd,'pauseStart':  day.pauseStart,'pauseEnd':  day.pauseEnd}, requestOptions);
        },
    assignScheduleToStation(station_id, schedule_id) {
        requestOptions.headers.Authorization = "Bearer "+auth.actions.getToken();
        return axios.get(baseUrl+"assignToStation/"+station_id+"/"+schedule_id, requestOptions);
    }
}