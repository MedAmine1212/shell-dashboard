import axios from "axios";
import CryptoJS from 'crypto-js'

const baseUrl = "http://localhost:8000/api/";
const SECRET_KEY = "SHELLSECRETKEY";
const USER_TYPE ="user_type";
const TOKEN = "access_token";
const BAR_CODE = "bar_code";
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

        setBarCode(barCode) {
            this.removeBarCode();
            window.localStorage.setItem(BAR_CODE, CryptoJS.AES.encrypt(barCode, SECRET_KEY).toString());
        },
        getBarCode() {
            if(window.localStorage.getItem(BAR_CODE))
                return CryptoJS.AES.decrypt(window.localStorage.getItem(BAR_CODE), SECRET_KEY).toString(CryptoJS.enc.Utf8);
            return null;
        },
        removeBarCode() {
            if(window.localStorage.getItem(BAR_CODE))
                window.localStorage.removeItem(BAR_CODE);
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
        getUser(barCode) {
            return axios.get(baseUrl+"getUserType/"+barCode);
        },
        authenticate(barCode, password) {
            return axios.post(baseUrl+"authenticate/",{"barCode": barCode, "password": password});
        }
    }
}