<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div style="max-width: 40%" class="dialog-box">
        <div class="dialog-header">
            <h5 class="dialog-title">Add services to {{station.label}}</h5>
            <button type="button" class="dialog-close" @click="close()">
                &times;
            </button>
        </div>

            <div style="overflow-y: auto;max-height: 600px;overflow-x: hidden" class="dialog-body">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else>
            <div v-if="services.length">
                <div style="display: flex" v-for="service in services" :key="service.id">
                    <single-service style="width: 80%" :sender="'stationAdd'"  :serv="service"></single-service>
                    <span v-if="!addingService" @click="addServiceToStation(service)" style="height:20px ;cursor: pointer;font-size: 15px;margin-left: 30px" title="Assign" class="badge badge-success"><i class="fas fa-check-double"></i></span>

                </div>
            </div>
        <div style="margin-top: 50px" v-else class="text-gray-600 text-center py-16">
            No available service to add
        </div>
        </div>
            </div>
        </div>
    </div>
</template>
<script>
    import SingleService from "../dashboard/SingleService";
    import ServiceService from "../../services/ServiceService";
    import StationServiceService from "../../services/StationServiceService";
    import Swal from 'sweetalert2'
    export default {
        name: 'AvailableServicesToAdd',
        components: {
            SingleService,
        },
        props: {
            station:Object,
            show: Boolean,
        },
        data() {
            return {
                addingService: false,
                loading: true,
                services: [],
            };
        },
        methods: {
            addServiceToStation(service) {
                Swal.fire({
                        title: "Service price",
                        text: "Set service price in this station: (DT)",
                        input: 'text',
                        inputValue: service.price,
                        showCancelButton: true,
                    }).then((result)=> {

                    if (result.isConfirmed) {
                    if (isNaN(result.value) || result.value.length === 0) {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Invalid price value',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        return;
                    }
                    this.addingService = true;
                    StationServiceService.addServiceToStation(service.id, this.station.id, result.value)
                        .then((res) => {
                            this.addingService = false;
                            this.services.splice(this.services.indexOf(service), 1);
                            this.$emit('add-service', res.data.stationService);
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(19,150,71,0.8)",
                                color: "white",
                                text: 'Service added successfully',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                });
            },
            addEmp(user) {
                this.$emit('add-emp', user);
            },
            close() {
                console.log(this.station);
                this.$emit('close');
            },
        },
        async created() {
            ServiceService.findAvailableServicesToAdd(this.station.id)
                .then((res)=>{
                    this.services = res.data.services;
                    this.loading = false;
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }
</script>