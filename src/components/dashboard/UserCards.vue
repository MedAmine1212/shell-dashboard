<template>
<div>
    <div style="width: 350px !important;z-index: 999;padding-top: 10px" class="d-none d-md-flex input-group w-auto my-auto">
        <input
                autocomplete="off"
                v-model="searchValue"
                type="search"
                class="form-control rounded"
                placeholder='Search here... (Name, Email, Phone)'
                style="min-width: 225px"
        />
        <span class="input-group-text border-0"
        ><i class="fas fa-search"></i
        ></span>
    </div><br>
    <div class="station-admin-container">
    <div v-if="sending" class="spinner-grow text-warning" style="position: absolute;height: 30px;width: 30px;top: 10px;left:80%" role="status"><span class="sr-only">Sending...</span></div>
<div v-for="user in usersList" :key="user.id" class="card stationAdmin" style="width: 18rem;">

    <router-link v-if="type ==='client'" :to="`/dashboard/vehicles/${user.id}`" style="cursor: pointer;font-size: 15px;position:absolute;margin-left: 20px;top:0;margin-top: 10px" title="Vehicles" class="badge badge-warning"><i class="fas fa-car"></i></router-link>
    <router-link v-if="type ==='employee' && !unassigned" :to="`/dashboard/consultations/employee/${user.id}`" style="cursor: pointer;font-size: 15px;position:absolute;margin-left: 20px;top:0;margin-top: 10px" title="Consultations" class="badge badge-warning"><i class="fas fa-info"></i></router-link>

    <div style="position: absolute;top:10px;width: 100px;left: 72%">
        <span v-if="unassigned && station && !sending" @click="assingEmployeeToStation(user)" style="cursor: pointer;font-size: 15px;margin-left: 30px" title="Assign" class="badge badge-success"><i class="fas fa-check-double"></i></span>

        <span v-if="!unassigned" @click="openEdit(user)" style="cursor: pointer;font-size: 15px" title="Edit" class="badge badge-success"><i class="fas fa-edit"></i></span>
        <span v-if="!unassigned" @click="showConfirmationDialog = true, selectedUser = {... user}" style="cursor: pointer;font-size: 15px" title="Delete" class="badge badge-danger"><i class="fas fa-trash"></i></span>
    </div>
    <div style="display:flex;width: 100%;justify-content: center">
        <img v-if="type === 'station admin'" class="stationAdminPic" width="80" src="../../assets/images/stationAdmin.png">
        <img v-else-if="type === 'employee'" class="stationAdminPic" width="80" src="../../assets/images/employee.png">
        <img v-else class="stationAdminPic" width="95" src="../../assets/images/client.png">
    </div>
    <div class="card-body">
        <span><b>Name:</b> {{user.user.firstName}} {{user.user.lastName}}</span><br>
        <span><b>Phone:</b> {{user.user.phone}}</span><br>
        <span><b>Email:</b> {{user.user.email}}</span><br>

        <span><b v-if="type !== 'client'">Station:</b><b v-else>Registered at:</b>
                    <span v-if="user.station">
                    <router-link title="Got to station details" :to="`/dashboard/bornes/${user.station.id}`" class="badge badge-success" >{{user.station.label}}</router-link>
                    <span @click="removeFromStation(user)" v-if="!unassigning && type !== 'client'" style="font-size: 15px;cursor: pointer" title="Unassign from station" class="badge badge-danger"><i class="far fa-minus-square"></i></span>
                    </span>
                <span class="badge badge-warning" v-else >No station set</span>
                </span>

        <hr v-if="type === 'client'">
        <span  v-if="type === 'client'"><b>Barcode:</b>
            <span class="badge badge-success" v-if="user.validated">{{user.user.barCode}}</span>
            <span class="badge badge-warning" v-else>Not set <span style="cursor: pointer;font-size: 12px;margin-left: 20px;text-decoration: underline" @click="selectedUser = {... user}, showSetBarCode = true" class="badge badge-success">Validate</span></span>
        </span>
    </div>
</div>
        <ConfirmationDialog :confirmationDialogTitle="confirmationMessage"
                            :show.sync="showConfirmationDialog"
                            @confirm="deleteUser()"
                            @close="showConfirmationDialog=false"
                            ref="confirmationDialog"></ConfirmationDialog>

        <add-user-dialog v-if="showModal"  :modalTitle="modalTitle"
                         :show.sync="showModal"
                         :user="selectedUser"
                         @user-emitted="updateUser"
                         :type="type"
                         @close="showModal=false"
                         ref="AddUserDialog" ></add-user-dialog>
        <bar-code   v-if="showSetBarCode"
                    :show.sync="showSetBarCode"
                    @user-emitted="setUserValidated"
                    :user="selectedUser"
                    @close="showSetBarCode=false"></bar-code>
    </div>
</div>
</template>


<script>

    import ConfirmationDialog from "../dialogs/ConfirmationDialog";
    import AddUserDialog from "../dialogs/AddUserDialog";
    import BarCode from "../dialogs/BarCode";
    import Swal from 'sweetalert2';
    import UserService from "../../services/UserService";
    import EmployeeService from "../../services/EmployeeService";
    import StationAdminService from "../../services/StationAdminService";
    export default {
        name: 'UserCards',
        components: {
            AddUserDialog,
            BarCode,
            ConfirmationDialog,
        },
        props: {
            station: Object,
            users: Object,
            type: String,
            unassigned: Boolean
        },
        computed: {
            usersList() {
                return this.users.filter((user)=> (user.user.firstName+" "+user.user.lastName+" "+user.user.email+" "+user.user.phone).toLowerCase().includes(this.searchValue.trim().toLowerCase()));
            },
        },
        data() {
            return {
                searchValue:'',
                unassigning:false,
                sending: false,
                showSetBarCode: false,
                modalTitle: "",
                showModal: false,
                selectedUser: null,
                confirmationMessage: "user",
                showConfirmationDialog: false,
            };
        },
        methods: {
            removeFromStation(user) {
                this.unassigning = true;
                if(this.type === "employee") {
                    EmployeeService.unassignFromStation(user.id,user.station.id)
                        .then(()=>{
                            this.unassigning = false;
                            if(!this.station)
                                user.station = null;
                            else{
                                // eslint-disable-next-line vue/no-mutating-props
                                this.users.splice(this.users.indexOf(user),1);
                            }
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(19,150,71,0.8)",
                                color: "white",
                                text:'Employee unassigned successfully',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                } else {
                    StationAdminService.unassignStationAdmin(user.station.id)
                        .then(()=>{
                            this.unassigning = false;
                            user.station = null;
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(19,150,71,0.8)",
                                color: "white",
                                text:'Station admin unassigned successfully',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                }
            },
            assingEmployeeToStation(user) {
                this.sending = true;
                EmployeeService.assignToStation(user.id, this.station.id)
                    .then(()=>{
                        // eslint-disable-next-line vue/no-mutating-props
                        this.users.splice(this.users.indexOf(user),1);
                        this.sending = false;
                        user.station = this.station;
                        this.$emit('add-emp', user);
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text:'Employee assigned successfully',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            setUserValidated(user) {
                this.$emit('user-emitted',user);
            },
            updateUser(user) {
                for (let i = 0; i < this.users.length; i++) {
                    if (this.users[i].id === user.id) {
                        // eslint-disable-next-line vue/no-mutating-props
                        this.users[i] = {...user};
                        this.selectedUser = null;
                        break;
                    }
                }
            },
            openEdit(user) {
                this.selectedUser = {...user};
                this.selectedUser.user = {...user.user};
                this.showModal = true;
                this.modalTitle='Edit '+ this.type;
            },
            deleteUser() {
                console.log(this.selectedUser);
                UserService.delete(this.selectedUser.user.id)
                    .then(()=>{
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text: this.type+' deleted successfully',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                       this.refreshUsers();
                    })
                    .catch((error)=>{
                        this.showConfirmationDialog = false;
                        console.log(error);
                    })
            },
            refreshUsers() {
                for(let i=0;i<this.users.length;i++) {
                    if(this.users[i].id === this.selectedUser.id){
                        // eslint-disable-next-line vue/no-mutating-props
                        this.users.splice(this.users.indexOf(this.users[i]),1);
                        this.selectedUser = null;
                        break;
                    }
                }
                this.showConfirmationDialog = false;
            }
        }

    }
</script>

