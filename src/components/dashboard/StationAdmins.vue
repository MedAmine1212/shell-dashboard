<template>
    <div>
        <button v-if="!loading" type="button" @click="openAdd()" style="float: right;margin-right: 40px" title="Add station admin" class="btn btn-warning"><i class="fas fa-plus"></i></button>

        <h1>Station admins</h1>
        <hr v-if="!loading">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="stationAdmins.length" >
            <UserCards :users="stationAdmins" :type="'station admin'"></UserCards>
        </div>

        <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
            No station admins to show
        </div>
        <add-user-dialog v-if="showModal"  :modalTitle="modalTitle"
                          :show.sync="showModal"
                            @user-emitted="addUser"
                          :user="null"
                          :type="'station admin'"
                         @close="showModal=false"
                         ref="AddUserDialog" ></add-user-dialog>
    </div>
</template>

<script>
    import StationAdminService from "../../services/StationAdminService";
    import AddUserDialog from "../dialogs/AddUserDialog";
    import UserCards from "./UserCards";
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'StationAdmins',
        components: {
           AddUserDialog,
            UserCards,
        },
        data() {
            return {
                sending:false,
                modalTitle: "",
                showModal: false,
                emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                confirmationMessage: "station admin",
                showConfirmationDialog: false,
                loading: true,
                stationAdmins: [],
            };
        },
        async created() {
           await StationAdminService.findAll()
               .then((res)=>{
                   this.stationAdmins = res.data.stationAdmins;
                   this.loading = false;
               })
               .catch((error)=>{
                   console.log(error);
                   this.loading = false;
               })
        },
        methods: {
           addUser(user) {
               this.stationAdmins.push(user);
           },
            openAdd() {
               this.showModal = true;
               this.modalTitle='Add station admin';
               console.log(this.showModal);
           },
        },
   }
</script>

