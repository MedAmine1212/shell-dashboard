<template>
    <div v-if="!loading" style="display: flex">
    <img style="margin-right: 20px" src="../../assets/images/consultation.png" width="120" height="140"/>
    <div style="margin-top: 10px" class="card-body">
        <div style="margin-bottom: 10px"><b>Label: </b>{{service.label}}</div>
        <div style="margin-bottom: 10px"><b><span v-if="sender === 'station'">Initial </span> price: </b>{{service.price}} DT</div>
        <div style="margin-bottom: 10px" v-if="sender ==='station'"><b>Price in this station: </b>{{stationPrice}} DT</div>
        <div><b>Duration: </b>{{service.duration}} Minutes</div>
        <hr style="width:100%">
    </div>
    <div v-if="sender === 'services'" style="float: right;display: flex;height: 40px;margin-right: 60px">
        <button class="btn btn-success" @click="selectedService = {...service}, showModal = true" title="Edit"><i class="far fa-edit"></i></button>
        <button class="btn btn-danger" @click="showConfirmationDialog = true, selectedService = {...service}" title="Delete"><i class="fas fa-trash-alt"></i></button>
    </div>

        <ConfirmationDialog :confirmationDialogTitle="'service'"
                            :show.sync="showConfirmationDialog"
                            @confirm="deleteService()"
                            @close="showConfirmationDialog=false"
                            ref="confirmationDialog"></ConfirmationDialog>

        <add-service-dialog v-if="showModal"  :modalTitle="'Update service'"
                            :show.sync="showModal"
                            :service="selectedService"
                            @service-emitted="updateService"
                            @close="showModal=false"
                            ref="AddServiceDialog" ></add-service-dialog>
</div>
</template>
<script>

    import ConfirmationDialog from "../dialogs/ConfirmationDialog";
    import ServiceService from "../../services/ServiceService";
    import AddServiceDialog from "../dialogs/AddServiceDialog";
    import Swal from 'sweetalert2';
    export default {

        name: 'SingleService',
        props: {
            sender: String,
            serv: Object,
        },
        components: {
            AddServiceDialog,
            ConfirmationDialog,
        },
        mounted() {
            if(this.sender === "station") {
                this.service = this.serv.service;
                this.stationPrice = this.serv.price;
            } else {
                this.service = this.serv;
            }
            this.loading = false;
        },
        data() {
            return {
                stationPrice:null,
                loading: true,
                service: null,
                showModal: false,
                showConfirmationDialog:false,
                selectedService:null,
            };
        },
        methods: {
            deleteService() {
                ServiceService.delete(this.selectedService.id)
                    .then(() => {
                        this.$emit('service-emitted', this.service, 'delete');
                        this.selectedService = null;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text: 'Service deleted successfully',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            },
            updateService(service) {
                 this.service = service;
                 this.selectedService = null;
            }
        }
    }
</script>