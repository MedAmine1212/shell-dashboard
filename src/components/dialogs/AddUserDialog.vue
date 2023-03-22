<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">{{modalTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Firstname</label>
                    <input v-if="thisUser" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisUser.user.firstName" type="text" id="firstNameEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="firstNameInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Lastname</label>
                    <input v-if="thisUser" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisUser.user.lastName" type="text" id="lastNameEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="lastNameInput"  class="form-control" />
                </div>
                <hr style="color: black">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Phone</label>
                    <input v-if="thisUser" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisUser.user.phone" type="text" id="phoneEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="phoneInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Email</label>
                    <input v-if="thisUser" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisUser.user.email" type="text" id="emailEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="emailInput"  class="form-control" />
                </div>
                <div v-if="type === 'employee'"  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Barcode</label>
                    <input v-if="thisUser" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisUser.user.barCode" type="text" id="barCodeEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" value="" type="text" id="barCodeInput"  class="form-control" />
                 </div>
                <div v-if="!thisUser && type !== 'client' && type !== 'employee'"  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Password</label>
                    <input style="border: 1px solid darkgrey;border-radius: 5px" value="" type="password" id="passwordInput"  class="form-control" />
                </div>
            </div>
            <div class="dialog-footer">
                <button v-if="thisUser" type="button" @click="editUser()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button v-else type="button" @click="addUser()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Add</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button type="button" class="btn btn-danger dialog-button" @click="close()">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import StationAdminService from "../../services/StationAdminService";
    import Swal from 'sweetalert2'
    import UserService from "../../services/UserService";
    import EmployeeService from "../../services/EmployeeService";
    import ClientService from "../../services/ClientService";
    export default {
        name: 'AddUserDialog',
        props: {
            user: Object,
            modalTitle: String,
            type: String,
            show: Boolean,
        },
        mounted() {
            this.thisUser = this.user;
            console.log(this.thisUser);
        },
        data() {
            return {
                emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                sending : false,
                thisUser: null,
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            checkInputs(firstName, lastName, phone, email) {
                if(firstName.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Firstname required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(lastName.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Lastname required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(phone.length !== 8 || isNaN(phone)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid phone number',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(!this.emailRegex.test(email)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid email',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                return true;
            },
            async addUser() {
                if (this.sending)
                    return;
                let firstName = document.getElementById("firstNameInput").value;
                let lastName = document.getElementById("lastNameInput").value;
                let phone = document.getElementById("phoneInput").value;
                let email = document.getElementById("emailInput").value;
                let password = "";
                if(this.type  !== "client" && this.type !== "employee")
                    password = document.getElementById("passwordInput").value;
                let barCode = "";
                if(this.type === "employee")
                    barCode = document.getElementById("barCodeInput").value;
                if(this.checkInputs(firstName, lastName, phone, email)) {
                    if(password.length < 4 && this.type !== 'client' && this.type !== "employee") {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Minimum password length is 4 characters',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        return;
                    }
                    if(this.type === 'employee' && (barCode.length === 0 || isNaN(barCode))) {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Invalid barcode',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        return;
                    }
                    this.sending = true;

                    if(this.type ==='station admin') {
                        StationAdminService.add(firstName, lastName, phone, email, password)
                            .then((res)=>{
                               this.refreshUser(res);
                            })
                            .catch((error)=>{
                                console.log(error.response);
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(228,161,27,0.8)",
                                    color: "white",
                                    text: error.response.data,
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                this.sending = false;
                            })
                    } else if(this.type === "employee"){
                        EmployeeService.add(firstName, lastName, phone, email, barCode)
                            .then((res)=>{
                                this.refreshUser(res);
                            })
                            .catch((error)=>{
                                console.log(error.response);
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(228,161,27,0.8)",
                                    color: "white",
                                    text: error.response.data,
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                this.sending = false;
                            })
                    } else {
                        ClientService.add(firstName, lastName, phone, email)
                            .then((res)=>{
                                this.refreshUser(res);
                            })
                            .catch((error)=>{
                                console.log(error.response);
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(228,161,27,0.8)",
                                    color: "white",
                                    text: error.response.data,
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                this.sending = false;
                            })
                    }
                }
            },
            async refreshUser(res) {
                let user;
                if(this.type === "station admin") {
                    user = res.data.stationAdmin;
                }
                else if(this.type === "employee"){
                    user = res.data.employee;
                } else {
                    user = res.data.client;
                }
                this.$emit('user-emitted',user);
                this.sending = false;
                this.close();
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text: this.type+' added successfully',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000
                });
            },
            async editUser() {
                if (this.sending)
                    return;
                if(this.checkInputs(this.thisUser.user.firstName, this.thisUser.user.lastName, this.thisUser.user.phone, this.thisUser.user.email)) {
                    this.sending = true;
                        UserService.update(this.thisUser.user)
                            .then(() => {
                                this.$emit('user-emitted',this.thisUser);
                                this.sending = false;
                                this.close();
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(19,150,71,0.8)",
                                    color: "white",
                                    text: this.type+' updated',
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(228,161,27,0.8)",
                                    color: "white",
                                    text: 'Phone number or email already in use',
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                                this.sending = false;
                            })
                }
            },
        }
    }
</script>