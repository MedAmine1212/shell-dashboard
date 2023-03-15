<template>
   <div>
       <span v-if="!loading">
           <h3 v-if="vehicle"><b>{{vehicle.client.user.firstName}} {{vehicle.client.user.lastName}}'s {{vehicle.brand}} {{vehicle.model}}</b> consultations</h3>
           <h3 v-else>Consultations done by <b>{{employee.user.firstName}} {{employee.user.lastName}}</b></h3>
       </span>
       <hr v-if="!loading">
       <div class="spinner-container" v-if="loading" >
           <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
       </div>
       <div v-else>
       <div v-if="consultations.length" >
           <div v-for="consultation in consultations" :key="consultation.id" style="display: flex">
            <img style="margin-right: 20px" src="../../assets/images/consultation.png" width="100" height="140"/>
               <div style="margin-top: 10px" class="card-body">
                   <span style="margin-right: 10px"><b>Date consultation: </b>
                       <span v-if="consultation.dateConsultation">{{consultation.dateConsultation}}</span>
                       <span class="badge badge-warning" v-else>Not set yet</span>
                   </span>
                   <span style="margin-right: 10px"><b>Status: </b>
                       <span v-if="consultation.status === -1" class="badge badge-warning">Not started</span>
                       <span v-else-if="consultation.status === 0" class="badge badge-info">In progress</span>
                       <span v-else class="badge badge-success">Done</span>
                   </span>
                   <span style="margin-right: 10px"><b>Duration: </b>{{consultation.duration}} Minutes</span><br><br>
                   <span style="margin-right: 10px" v-if=" vehicle && consultation.employee"><b>Employee: </b>{{consultation.employee.user.firstName}} {{consultation.employee.user.lastName}}</span>
                   <span v-else-if="employee" style="margin-right: 10px"><b>Client: </b>{{consultation.vehicle.client.user.firstName}} {{consultation.vehicle.client.user.lastName}}'s {{consultation.vehicle.brand}} {{consultation.vehicle.model}}</span>
                   <span style="margin-right: 10px"><b>Type: </b>{{consultation.type}}</span>
                   <span v-if="consultation.price" style="margin-right: 10px"><b>Price: </b>{{consultation.price}} DT</span>
                   <span v-if="consultation.discount" style="margin-right: 10px"><b>Discount: </b>{{consultation.discount}} DT</span><br><br>
                  <div style="display: flex"> <span><b>Service: </b></span> <span style="margin-left: 10px;" v-if="!consultation.consultation_service">No services selected for this consultation</span>
                   <table v-else style="margin-left: 10px;margin-top: -13px;width: 500px" class="table table-striped align-middle mb-0 bg-white">

                       <thead>
                   <tr>
                       <th><b>Label</b></th>
                       <th><b>Duration (Minutes)</b></th>
                       <th><b>Price (DT)</b></th>
                   </tr>
                       </thead>

                       <tbody>
                   <tr v-for="cs in consultation.consultation_service" :key="cs.service.id">
                       <td style="margin-right: 10px;width: 150px">{{cs.service.label}}</td>
                       <td style="margin-right: 10px;width: 200px">{{cs.service.duration}}</td>
                       <td style="margin-right: 10px">{{cs.service.price}}</td>
                   </tr>
                       </tbody>
                   </table>
                  </div>
                   <hr style="width:100%;margin-left: -100px">
               </div>
               <div style="float: right;display: flex;height: 40px;margin-right: 60px">
                     <button class="btn btn-danger" @click="selectedConsultation = consultation, showConfirmationDialog = true" title="Delete"><i class="fas fa-trash-alt"></i></button>
               </div>
           </div>
       </div>

       <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
           No consultations to show
       </div>
       </div>
       <ConfirmationDialog :confirmationDialogTitle="'consultation'"
                           :show.sync="showConfirmationDialog"
                           @confirm="deleteConsultation()"
                           @close="showConfirmationDialog=false"
                           ref="confirmationDialog"></ConfirmationDialog>
    </div>
</template>

<script>
    import ConsultationService from "../../services/ConsultationService";
    import ConfirmationDialog from "../dialogs/ConfirmationDialog";
    import Swal from 'sweetalert2';
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Vehicles',
        components: {
            ConfirmationDialog,
        },
        data() {
            return {
                showConfirmationDialog:false,
                selectedConsultation:null,
                loading: true,
                consultations: [],
                vehicle: null,
                employee: null
            };
        },
        methods: {
            async deleteConsultation() {
                ConsultationService.delete(this.selectedConsultation.id)
                    .then(()=>{
                        if(this.vehicle) {
                            this.vehicle.consultations.splice(this.vehicle.consultations.indexOf(this.selectedConsultation),1);
                            this.selectedConsultation = null;
                        } else {
                            this.employee.consultations.splice(this.employee.consultations.indexOf(this.selectedConsultation),1);
                            this.selectedConsultation = null;
                        }
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text:'Consultation deleted successfully',
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
        async created() {
           if(this.$route.params.sender === 'vehicle') {
           ConsultationService.fndAllByVehicle(this.$route.params.id)
               .then((res)=>{
                   this.vehicle = res.data.vehicle;
                   this.consultations = this.vehicle.consultations;
                   this.loading = false;
               })
               .catch((err)=>{
                   console.log(err);
               });
        } else {
               ConsultationService.findAllByEmployee(this.$route.params.id)
                   .then((res)=>{
                       this.employee = res.data.employee;
                       console.log(this.employee);
                       this.consultations = this.employee.consultations;
                       this.loading = false;
                   })
                   .catch((err)=>{
                       console.log(err);
                   });
           }
        }
   }
</script>

