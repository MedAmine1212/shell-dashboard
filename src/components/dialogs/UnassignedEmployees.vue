<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div style="max-width: 72%" class="dialog-box">
        <div class="dialog-header">
            <h5 class="dialog-title">{{modalTitle}}</h5>
            <button type="button" class="dialog-close" @click="close()">
                &times;
            </button>
        </div>

            <div style="overflow-y: auto;max-height: 600px;overflow-x: hidden" class="dialog-body">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else>
        <div v-if="users.length">
            <div>
                <UserCards @add-emp="addEmp" :users="users" :station="station" :unassigned="true" :type="'employee'"></UserCards>
            </div>
        </div>
        <div style="margin-top: 50px" v-else class="text-gray-600 text-center py-16">
            No unassigned employees
        </div>
        </div>
            </div>
        </div>
    </div>
</template>
<script>
    import UserCards from "../dashboard/UserCards";
    import EmployeeService from "../../services/EmployeeService";
    export default {
        name: 'AddServiceDialog',
        components: {
            UserCards,
        },
        props: {
            station: Object,
            modalTitle: String,
            show: Boolean,
        },
        data() {
            return {
                loading: true,
                sending : false,
                users: null,
            };
        },
        methods: {
            addEmp(user) {
                this.$emit('add-emp', user);
            },
            close() {
                this.$emit('close');
            },
        },
        async created() {
            EmployeeService.getAllUnassigned()
                .then((res)=>{
                    this.users = res.data.employees;
                    this.loading = false;
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }
</script>