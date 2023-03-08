<template>
<div>
    <div v-if="!loading" class="header-container">
        <div class="button-container">
            <button v-if="!loading && this.saveEdit" type="button" @click="saveEditedStation()"  title="Save changes"  class="btn btn-success">Save change</button>
            <button v-if="!loading && this.saveEdit" type="button"  @click="this.editedStation = {...this.station}, saveEdit = false" title="Cancel changes"  class="btn btn-warning">Cancel change</button>
        <button v-if="!loading" type="button" @click="showConfirmationDialog = true, confirmationDialogTitle = 'this station',clickedFrom=1" title="Delete station"  class="btn btn-danger">Delete</button>
        </div>
        <div style="height: 40px">
        <h2 v-if="!editLabel">{{editedStation.label}} <span @click="editLabel = true" class="badge badge-success"  style="cursor:pointer;margin-left: 15px;font-size: 12px" title="edit">
                        <i class="far fa-edit"></i>
                    </span></h2>
        <span style="min-width: 500px" v-else>
            <div style="display: flex">
            <input type="text" style="width: 200px" id="stationLabel" v-model="editedStation.label" class="form-control">
             <span @click="saveStation('editLabel')" style="font-size: 20px;cursor:pointer;height: 30px;margin-top:2px;border-radius:5px " title="Save" class="badge badge-success">
                            <i class="far fa-check-circle"></i>
                    </span>
                        <span @click="this.editLabel = false, this.editedStation.label = this.station.label" style="font-size: 20px;cursor:pointer;height: 30px;margin-top: 2px;border-radius:5px " title="Cancel" class="badge badge-danger">
                            <i class="fas fa-times-circle"></i>
                    </span>
                </div>
        </span>
        </div>
        <hr style="width: 45px;margin-left: 18px">
        <h6 style="margin-left: 10px">
            <b style="margin-right: 7px">Station manager:</b>
            <span v-if="station.station_admin" class="badge badge-success">
                <span style="cursor:pointer;">{{station.station_admin.user.firstName}} {{station.station_admin.user.lastName}}</span>
                 <span  style="cursor:pointer;margin-left: 15px" title="edit">
                        <i class="far fa-edit"></i>
                    </span>
            </span>
            <span v-else class="badge badge-warning">
                <span style="cursor:pointer;">No set</span>
             <span  style="cursor:pointer;margin-left: 15px" title="edit">
                        <i class="far fa-edit"></i>
                    </span>
            </span>
        </h6>
        <hr style="width: 45px;margin-left: 18px">
        <h6 style="margin-left: 10px">
            <b style="margin-right: 7px">Work schedule:</b>
            <span v-if="station.work_schedule" class="badge badge-success">
                <span style="cursor:pointer;"><b>shift start:</b> {{station.work_schedule.shiftStart}}, <b>Shift end:</b> {{station.work_schedule.shiftEnd}} | <b>Pause start:</b> {{station.work_schedule.pauseStart}}, <b>Pause end:</b> {{station.work_schedule.pauseEnd}}</span>
                 <span  style="cursor:pointer;margin-left: 15px" title="edit">
                        <i class="far fa-edit"></i>
                    </span>
            </span>
            <span v-else class="badge badge-warning">
                <span style="cursor:pointer;">No set</span>
             <span  style="cursor:pointer;margin-left: 15px" title="edit">
                        <i class="far fa-edit"></i>
                    </span>
            </span>
        </h6>
        <hr style="width: 45px;margin-left: 18px">
        <div style="height: 40px">
        <h6 v-if="!editAddress" style="margin-left: 10px"><b>Address:</b> {{editedStation.address}}
            <span class="badge badge-success" @click="editAddress = true"  style="cursor:pointer;margin-left: 15px" title="edit">
                        <i class="far fa-edit"></i>
                    </span></h6>
        <span style="min-width: 500px" v-else>
            <div style="display: flex">
            <input type="text" style="width: 200px" id="stationAddress" v-model="editedStation.address" class="form-control">
             <span @click="saveStation('editAddress')" style="font-size: 20px;cursor:pointer;height: 30px;margin-top:2px;border-radius:5px " title="Save" class="badge badge-success">
                            <i class="far fa-check-circle"></i>
                    </span>
                        <span @click="this.editAddress = false, this.editedStation.address = this.station.address" style="font-size: 20px;cursor:pointer;height: 30px;margin-top: 2px;border-radius:5px " title="Cancel" class="badge badge-danger">
                            <i class="fas fa-times-circle"></i>
                    </span>
                </div>
        </span>
        </div>
    </div>
    <hr v-if="!loading" style="border:1px solid black">
    <button v-if="!loading" type="button" @click="showModal = true" title="Add borne" class="btn btn-warning button-container"><i class="fas fa-plus"></i></button>

    <span style="margin-left: 5px" v-if="!loading">
        <h3 v-if="bornes.length">Bornes</h3>
    </span>
    <div class="spinner-container" v-if="loading" >
    <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
    </div>
    <div v-else-if="bornes.length" class="borne-container">
            <div class="borne" v-for="borne in bornes" :key="borne.id">
                <img title="Online" v-if="borne.status" height="170" src="./../../assets/images/borne-online.png">
                <img title="Offline" v-else height="170" src="./../../assets/images/borne-offline.png">
            <h5 style="margin-top: 15px;margin-left: 12px;width: 100px">Borne {{borne.id}}</h5> <span style="cursor: pointer" @click="showDetailsModal(borne)" class="badge badge-warning">Details</span>
        </div>
    </div>

    <div style="margin-top: 100px" v-else class="text-gray-600 text-center py-16">
        No bornes in this station
    </div>

    <!--Add a new borne modal-->
    <div v-if="showModal" class="dialog-container" :class="{ 'd-none': !showModal }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">Add a new borne</h5>
                <button type="button" class="dialog-close" @click="showModal = false">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div style="display: flex"><label>Heartbeat interval</label> <div title="The time between each borne heartbeat" class="question-info"><i class="fas fa-question"></i></div></div>
                <div style="margin-top: 30px;display: flex;width: 100%">
                    <input id="heartBeatInput" style="width: 85%" type="number" min="1" class="form-control" placeholder="Time in minutes">
                    <div style="margin-left: 10px;margin-top: 4px;float: right">(minutes)</div>
                </div>
            </div>
            <div class="dialog-footer">
                <button type="button" class="btn btn-info dialog-button" @click="addBorne()">
                    Add
                </button>
                <button type="button" class="btn btn-danger dialog-button" @click="showModal = false">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <!--Borne details modal-->

    <div v-if="showDetailsModel" class="dialog-container" :class="{ 'd-none': !showDetailsModel }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">Borne <b>{{this.selectedBorne.id}}</b> details</h5>
                <button type="button" class="dialog-close" @click="showDetailsModel = false, editBorne = false">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <span><span style="font-weight: bold">Borne ID:</span> {{this.selectedBorne.id}}</span><br>
                <span><span style="font-weight: bold">Status:</span> <span v-if="selectedBorne.status" class="badge badge-success">Online</span><span v-else class="badge badge-danger">Offline</span></span><br>
                <span><span style="font-weight: bold">Last heartbeat:</span> {{this.selectedBorne.lastHeartBeat}}</span><br>
                <div style="width: 100%;display: flex;height: 50px;margin-top: 5px">
                    <span style="font-weight: bold;margin-right: 5px">Heartbeat interval: </span>
                        <span v-if="!editBorne">{{this.selectedBorne.heartBeatInterval}} (Minutes)
                    <span  @click="this.editBorne = true" style="font-size: 15px;cursor:pointer" title="edit" class="badge badge-warning">
                        <i class="far fa-edit"></i>
                    </span>
                    </span>
                    <div style="width: 60%;margin-left: 10px;display:flex" v-else>
                        <input id="heartBeatInputEdit" :value="this.selectedBorne.heartBeatInterval" style="height: 25px;width: 70%" type="number" min="1" class="form-control" placeholder="Time in minutes">
                        <span @click="editSelectedBorne()" style="font-size: 20px;cursor:pointer;height: 30px;margin-top: -2px;border-radius:5px " title="Save" class="badge badge-success">
                            <i class="far fa-check-circle"></i>
                    </span>
                        <span @click="this.editBorne = false" style="font-size: 20px;cursor:pointer;height: 30px;margin-top: -2px;border-radius:5px " title="Cancel" class="badge badge-danger">
                            <i class="fas fa-times-circle"></i>
                    </span>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">

                <button type="button" @click="showConfirmationDialog = true, confirmationDialogTitle='borne '+selectedBorne.id, clickedFrom = 0" class="btn btn-danger dialog-button">
                    Delete
                </button>
                <button type="button" class="btn btn-info dialog-button" @click="showDetailsModel = false, editBorne = false">
                    Close
                </button>
            </div>
        </div>
    </div>

    <!--Confirmation dialog-->
    <div v-if="showConfirmationDialog" class="dialog-container" :class="{ 'd-none': !showConfirmationDialog }">
        <div class="dialog-box" style="max-width: 350px">
            <div class="dialog-header">
                <h5 class="dialog-title">Delete {{confirmationDialogTitle}}</h5>
                <button type="button" class="dialog-close" @click="showConfirmationDialog = false">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
               Are you sure you want to proceed ?
            </div>
            <div class="dialog-footer">
                <button type="button" class="btn btn-danger dialog-button" @click="deleteBorneStation()">
                    Yes
                </button>
                <button type="button" class="btn btn-info dialog-button" @click="showConfirmationDialog = false">
                    No
                </button>
            </div>
        </div>
    </div>

</div>
</template>

<script>
    import BorneService from "./../../services/BorneService";
    import StationService from "./../../services/StationService";
    import Echo from "laravel-echo";
    import 'bootstrap/dist/js/bootstrap.bundle.min.js'
   import Swal from 'sweetalert2'
   import router from "@/router";
   export default {
       data() {
           return {
               saveEdit: null,
               editedStation: null,
               editLabel: false,
               editAddress: false,
               clickedFrom:-1,
               station: null,
               confirmationDialogTitle: "",
               showConfirmationDialog: false,
               editBorne: false,
               showModal: false,
               showDetailsModel: false,
               echo: null,
               bornes: [],
               loading : true,
               minutes: null,
               selectedBorne:null,
           };
       },
       // eslint-disable-next-line vue/multi-word-component-names
       name: 'Bornes',
        methods: {
            saveEditedStation() {
                this.saveEdit = false;
                StationService.updateStation(this.station.id,this.editedStation)
                    .then(()=>{
                        this.station = {...this.editedStation};
                        this.saveEdit = false;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text: 'Station updated successfully',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
            },
            saveStation(edit) {
                if(edit === "editLabel") {
                    if(this.editedStation.label !== this.station.label) {
                        if(this.editedStation.label.length < 5) {
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Minimum station name length : 5 letters',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {
                            this.saveEdit = true;
                            this.editLabel = false;
                        }
                    } else {
                        this.editLabel = false;
                    }
                } else if(edit === "editAddress") {
                    if(this.editedStation.address !== this.station.address) {
                        if(!this.editedStation.address.length) {
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Station address required',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {
                            this.saveEdit = true;
                            this.editAddress = false;
                        }
                    } else {
                        this.editAddress = false;
                    }
                }
            },
           async deleteBorneStation() {
            this.showConfirmationDialog = false;
            if(this.clickedFrom == 0) {
            BorneService.deleteBorne(this.selectedBorne.id)
                .then(() => {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(19,150,71,0.8)",
                        color: "white",
                        text: 'Borne deleted successfully',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    this.bornes.splice(this.bornes.indexOf(this.selectedBorne),1);
                    this.editBorne = false;
                    this.showDetailsModel = false;
                    this.selectedBorne = null;

                })
                .catch((error) => {
                    console.error(error);
                });
            } else if(this.clickedFrom == 1) {
                StationService.deleteStation(this.station.id)
                    .then(() => {
                        router.push({name: "stations"});
                    })
                    .catch((error) => {
                        console.error(error);
                    });

            }
            this.clickedFrom = -1;
           },
           async editSelectedBorne() {
               let min = document.getElementById("heartBeatInputEdit").value;
               if(isNaN(min) || min < 1 || min >60) {
                   await Swal.fire({
                       position: 'bottom-right',
                       background: "rgba(228,161,27,0.8)",
                       color: "black",
                       text: 'Invalid value (Min: 1 minute, Max: 60 minutes)',
                       timerProgressBar: true,
                       showConfirmButton: false,
                       timer: 2500
                   })
               } else if(min == this.selectedBorne.heartBeatInterval) {
                   console.log(min);
                   await Swal.fire({
                       position: 'bottom-right',
                       background: "rgba(228,161,27,0.8)",
                       color: "black",
                       text: 'Value unchanged',
                       timerProgressBar: true,
                       showConfirmButton: false,
                       timer: 1500
                   })
               } else {
                   await BorneService.updateInterval(this.selectedBorne.id, min)
                       .then(() => {
                           for (let i=0;i<this.bornes.length;i++) {
                                if(this.bornes[i].id === this.selectedBorne.id){
                                    this.bornes[i].heartBeatInterval = min;
                                    break;
                                }
                           }
                           Swal.fire({
                               position: 'bottom-right',
                               background: "rgba(19,150,71,0.8)",
                               color: "white",
                               text: 'Heartbeat interval updated successfully',
                               timerProgressBar: true,
                               showConfirmButton: false,
                               timer: 1000
                           });
                           this.editBorne = false;
                       })
                       .catch((error) => {
                           console.error(error);
                       });
               }
           },
           async showDetailsModal(borne) {
               this.selectedBorne = borne;
               this.showDetailsModel = true;
           },
          async addBorne() {
              this.minutes = document.getElementById("heartBeatInput").value;
              if(isNaN(this.minutes) || this.minutes < 1 || this.minutes >60) {
                  await Swal.fire({
                      position: 'bottom-right',
                      background: "rgba(228,161,27,0.8)",
                      color: "black",
                      text: 'Invalid value (Min: 1 minute, Max: 60 minutes)',
                      timerProgressBar: true,
                      showConfirmButton: false,
                      timer: 2500
                  })
              }  else {
                  await BorneService.addBorne(this.$route.params.id, this.minutes)
                      .then((response) => {
                          this.minutes = null;
                          Swal.fire({
                              position: 'bottom-right',
                              background: "rgba(19,150,71,0.8)",
                              color: "white",
                              text: 'Borne added successfully',
                              timerProgressBar: true,
                              showConfirmButton: false,
                              timer: 1000
                          });
                          this.selectedBorne = null;
                          this.bornes.push(response.data.borne);
                          this.showModal = false;

                      })
                      .catch((error) => {
                          console.error(error);
                          this.showModal = false;
                      });
              }
          }
        },

       async created() {
           await StationService.findById(this.$route.params.id)
               .then( async (response) => {
                   this.station = response.data.station;
                   this.editedStation = {...this.station};
                   console.log(this.station);
                   await BorneService.getAllByStationId(this.$route.params.id)
                       .then((response) => {
                           this.bornes = response.data.bornes;
                           this.loading = false;
                       })
                       .catch((error) => {
                           console.error(error);
                       });

                   this.echo = new Echo({
                       broadcaster: "pusher",
                       cluster: 'mt1',
                       key:'shellwebsocketappkey',
                       wsHost: "127.0.0.1",
                       wsPort: 6001,
                       disableStats: false,
                       forceTLS: false,
                       encrypted: false,
                       enabledTransports: ['ws', 'wss'],
                       activityTimeout: 5000
                   });
                   this.echo.channel("superAdmin").listen("SuperAdminEvent", (e) => {
                       this.bornes.forEach((borne)=>{
                           if(borne.id == e.message.borne_id) {
                               if(e.message.type === "borneConnected")
                                   borne.status = true;
                               else
                                   borne.status = false;
                           }
                       })
                   });

               })
               .catch(()=>{
                   router.push({name: "dashboard"});

               });
       },
   }
</script>

