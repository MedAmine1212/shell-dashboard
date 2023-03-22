<template>
    <div>
        <div v-if="!loading" class="header-container">
            <button type="button" @click="showModal = true, selectedService = null" style="float: right;margin-right: 60px" title="Add service" class="btn btn-warning"><i class="fas fa-plus"></i></button>
            <div style="display: flex">
                <h2 style="margin-left: 10px"><b>Services</b></h2>
                <div style="width: 350px !important;z-index: 999;margin-left: 20px;margin-top: -3px" class="d-none d-md-flex input-group w-auto my-auto">
                    <input
                            autocomplete="off"
                            v-model="searchValue"
                            type="search"
                            class="form-control rounded"
                            placeholder='Search here...'
                            style="min-width: 225px"
                    />
                    <span class="input-group-text border-0"
                    ><i class="fas fa-search"></i
                    ></span>
                </div>
            </div>
            <hr style="">
        </div>
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="!loading && services.length">
        <div v-for="service in servicesList" :key="service.id">
            <single-service @service-emitted="updateServices" :sender="'services'" :serv="service"></single-service>
        </div>
        </div>
        <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
            No services to show
        </div>

        <add-service-dialog v-if="showModal"  :modalTitle="'Add service'"
                            :show.sync="showModal"
                            :service="null"
                            @service-emitted="addService"
                            @close="showModal=false"
                            ref="AddServiceDialog" ></add-service-dialog>

    </div>
</template>

<script>
    import ServiceService from "../../services/ServiceService";
    import SingleService from "./SingleService";
    import AddServiceDialog from "../dialogs/AddServiceDialog";

    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Services',
        components: {
            AddServiceDialog,
            SingleService,
        },
        data() {
            return {
                searchValue: "",
                showModal: false,
                showConfirmationDialog:false,
                loading: true,
                services: [],
            };
        },
        methods: {
            addService(service) {
                this.services.push(service);
            },
           updateServices(service, action) {
             if(action === "delete") {
                 this.services.splice(this.services.indexOf(service), 1);
             }
           },
        },
        computed: {
            servicesList() {
                return this.services.filter((service)=> service.label.toLowerCase().includes(this.searchValue.trim().toLowerCase()));
            },

        },
        async created() {
           ServiceService.findAll()
               .then((res)=>{
                    this.services = res.data.services;
                    this.loading = false;
               })
               .catch((err)=>{
                   this.loading = false;
                   console.log(err);
               })
        }
   }
</script>

