<template>
   <div>
       <button v-if="!loading" type="button" @click="showModal = true, modalTitle='Add vehicle', selectedVehicle = null" style="float: right;margin-right: 40px" title="Add vehicle" class="btn btn-warning"><i class="fas fa-plus"></i></button>

       <span v-if="!loading && client">
           <h3><b>{{client.user.firstName}} {{client.user.lastName}}</b> vehicles</h3>
       </span>
       <hr v-if="!loading">
       <div class="spinner-container" v-if="loading" >
           <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
       </div>
       <div v-else-if="client">
       <div v-if="client.vehicles.length" >
           <div v-for="vehicle in client.vehicles" :key="vehicle.id" style="display: flex">
            <img style="margin-right: 20px" src="../../assets/images/vehicle.png" width="200"/>
               <div style="margin-top: 10px" class="card-body">
                   <span style="margin-right: 10px"><b>Matricule: </b>{{vehicle.matricule}}</span>
                   <span style="margin-right: 10px"><b>Brand: </b>{{vehicle.brand}}</span>
                   <span style="margin-right: 10px"><b>Model: </b>{{vehicle.model}}</span>
                   <span><b>Year: </b>{{vehicle.year}}</span><br>
                   <span><b>Fuel type: </b></span>{{vehicle.fuelType}}<br>
                   <span><b>Mileage: </b></span>{{vehicle.mileage}} KM<br>
                   <span><b>Last oil change: </b>{{vehicle.lastOilChange}}</span><br>
                    <hr style="width:80%;">
               </div>
               <div style="float: right;display: flex;height: 40px;margin-right: 60px">
                    <button @click="selectedVehicle = {...vehicle}, showModal = true, modalTitle = 'Edit vehicle'" class="btn btn-success" title="Edit"><i class="far fa-edit"></i></button>
                    <router-link :to="`/dashboard/consultations/vehicle/${vehicle.id}`" class="btn btn-warning" title="Consultations"><i class="fas fa-info"></i></router-link>
                    <button class="btn btn-danger" @click="selectedVehicle = {...vehicle}, showConfirmationDialog = true" title="Delete"><i class="fas fa-trash-alt"></i></button>
               </div>
           </div>
       </div>

       <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
           No vehicles to show
       </div>
       </div>

       <add-vehicle-dialog v-if="showModal"  :modalTitle="modalTitle"
                        :show.sync="showModal"
                        :vehic="selectedVehicle"
                        :clientId="client.id"
                        @vehicle-emitted="updateVehicle"
                        @close="showModal=false"
                        ref="AddUserDialog" ></add-vehicle-dialog>

       <ConfirmationDialog :confirmationDialogTitle="'vehicle'"
                           :show.sync="showConfirmationDialog"
                           @confirm="deleteVehicle()"
                           @close="showConfirmationDialog=false"
                           ref="confirmationDialog"></ConfirmationDialog>
    </div>
</template>

<script>
    import VehicleService from "../../services/VehicleService";
    import AddVehicleDialog from "../dialogs/AddVehicleDialog";
    import ConfirmationDialog from "../dialogs/ConfirmationDialog";
    import Swal from 'sweetalert2';
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Vehicles',
        components: {
            AddVehicleDialog,
            ConfirmationDialog,
        },
        data() {
            return {
                showConfirmationDialog: false,
                selectedVehicle: null,
                showModal:false,
                client:null,
                loading: true,
            };
        },
        methods: {
            deleteVehicle() {
                VehicleService.delete(this.selectedVehicle.id)
                    .then(()=>{
                        for(let i=0;i<this.client.vehicles.length;i++) {
                            if(this.client.vehicles[i].id === this.selectedVehicle.id) {
                                this.client.vehicles.splice(i,1);
                                this.selectedVehicle = null;
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(19,150,71,0.8)",
                                    color: "white",
                                    text:'Vehicle deleted successfully',
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                                break;
                            }
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            updateVehicle(vehicle) {
                if(this.selectedVehicle) {
                    for(let i=0;i<this.client.vehicles.length;i++) {
                        if(this.client.vehicles[i].id === vehicle.id) {
                            this.client.vehicles[i] = vehicle;
                            this.selectedVehicle = null;
                            break;
                        }
                    }
                }
                else
                    this.client.vehicles.push(vehicle);
            }
        },
        async created() {
           VehicleService.findAllByClient(this.$route.params.id)
               .then((res)=>{
                   this.client = res.data.client;
                   this.loading = false;
               })
               .catch((err)=>{
                   console.log(err);
               });
        }
   }
</script>

