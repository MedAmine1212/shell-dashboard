import axios from "axios";
import CryptoJS from 'crypto-js'

const baseUrl = process.env.VUE_APP_API_BASE_URL+"api/";
const SECRET_KEY = "SHELLSECRETKEY";
const USER_TYPE ="user_type";
const TOKEN = "access_token";
export default {
    actions: {
        setUserType(userType) {
            this.removeUserType();
            window.localStorage.setItem(USER_TYPE, CryptoJS.AES.encrypt(userType, SECRET_KEY).toString());
        },
        getUserType() {
            if(window.localStorage.getItem(USER_TYPE))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(USER_TYPE), SECRET_KEY).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeUserType() {
            if(window.localStorage.getItem(USER_TYPE))
                window.localStorage.removeItem(USER_TYPE);
        },

        setToken(token) {
            this.removeToken();
            window.localStorage.setItem(TOKEN, CryptoJS.AES.encrypt(token, SECRET_KEY).toString());
        },
        getToken() {
            if(window.localStorage.getItem(TOKEN))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(TOKEN), SECRET_KEY).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeToken() {
            if(window.localStorage.getItem(TOKEN))
                window.localStorage.removeItem(TOKEN);
        },
        authenticate(email, password) {
            return axios.post(baseUrl+"authenticate/admin",{"email": email, "password": password});
        }
    }
}