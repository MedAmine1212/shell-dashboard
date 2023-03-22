<template>
    <div> <button v-if="!loading" type="button" @click="showModal = true, modalTitle='Add employee'" style="float: right;margin-right: 40px" title="Add station admin" class="btn btn-warning"><i class="fas fa-plus"></i></button>

        <h1>Employees</h1>
         <hr v-if="!loading">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="employees.length" >
           <UserCards :users="employees" :type="'employee'"></UserCards>
        </div>

        <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
            No employees to show
        </div>


        <add-user-dialog v-if="showModal"  :modalTitle="modalTitle"
                         :show.sync="showModal"
                         @user-emitted="addUser"
                         :user="null"
                         :type="'employee'"
                         @close="showModal=false"
                         ref="AddUserDialog" ></add-user-dialog>
    </div>
</template>


<script>

    import UserCards from "./UserCards";
    import AddUserDialog from "../dialogs/AddUserDialog";
    import EmployeeService from "../../services/EmployeeService";
    export default {

        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Employees',
        components: {
            AddUserDialog,
           UserCards,
        },
        async created() {
            await EmployeeService.findAll()
                .then((res)=>{
                    this.employees = res.data.employees;
                    this.loading = false;
                })
                .catch((error)=>{
                    console.log(error);
                    this.loading = false;
                })
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
                employees: [],
            };
        },
        methods: {
            addUser(user) {
                this.employees.push(user);
            },
        }
   }
</script>

