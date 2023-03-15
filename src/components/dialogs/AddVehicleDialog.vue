<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">{{modalTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body" style="height: 500px">
                <div style="display: flex;width: 100%;justify-content: center">
                    <span   @click="firstPart = true" class="numerator" :class="{'numerator-active': firstPart}">1</span> <span style="margin-top: 20px">----</span> <span @click="firstPart = false" class="numerator" :class="{'numerator-active': !firstPart}">2</span>
                </div>

                <div :class="{ 'd-none': !firstPart }">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Matricule</label>
                    <input v-if="vehicle" style="border: 1px solid darkgrey;border-radius: 5px" v-model="vehicle.matricule" type="text" id="matriculeEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="matriculeInput" placeholder="xxxTUNxxxx"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Brand</label>
                    <input v-if="vehicle" style="border: 1px solid darkgrey;border-radius: 5px" v-model="vehicle.brand" type="text" id="brandEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="brandInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Model</label>
                    <input v-if="vehicle" style="border: 1px solid darkgrey;border-radius: 5px" v-model="vehicle.model" type="text" id="modelEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="modelInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Year</label>
                    <input v-if="vehicle" style="border: 1px solid darkgrey;border-radius: 5px" v-model="vehicle.year" type="text" id="yearEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="yearInput"  class="form-control" />
                </div>
                </div>
                <div :class="{ 'd-none': firstPart }">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Fuel type</label>
                    <select class="form-control" id="fuelTypeSelect" style="border: 1px solid darkgrey">
                        <option :selected="vehicle && vehicle.fuelType === 'Diesel'" value="Diesel">Diesel</option>
                        <option :selected="vehicle && vehicle.fuelType === 'Petrol'" value="Petrol">Petrol</option>
                    </select>
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Mileage</label>
                    <input v-if="vehicle" style="border: 1px solid darkgrey;border-radius: 5px" v-model="vehicle.mileage" type="text" id="mileageEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="mileageInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Last oil change</label>
                    <vue-date-picker class="form-control" v-if="vehicle" v-model="vehicle.lastOilChange" ></vue-date-picker>
                    <vue-date-picker class="form-control" v-else v-model="newDate"></vue-date-picker>
                </div>
            </div>
            </div>
            <div class="dialog-footer">
                <button v-if="vehicle" type="button" @click="editVehicle()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button v-else type="button" @click="addVehicle()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Add</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button type="button" class="btn btn-danger dialog-button" @click="close()">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import Swal from 'sweetalert2'
    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css';
    import VehicleService from "../../services/VehicleService";
    export default {
        name: 'AddUserDialog',
        props: {
            vehic: Object,
            clientId: Number,
            modalTitle: String,
            show: Boolean,
        },
        components: {
            VueDatePicker
        },
        mounted() {
            this.vehicle = this.vehic;
        },
        data() {
            return {
                newDate: "",
                regex: /^\d{3}[a-zA-Z]{3}\d{4}$/,
                firstPart: true,
                sending : false,
                vehicle: null,
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            checkInputs(matricle, brand, model, year, mileage) {
                if(!this.regex.test(matricle)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid matricule',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(brand.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Brand required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(model.length ===0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Model required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(isNaN(mileage) || mileage.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid mileage',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                console.log(mileage);
                return true;
            },
            async addVehicle() {
                if (this.sending)
                    return;
                let matricule = document.getElementById("matriculeInput").value;
                let brand = document.getElementById("brandInput").value;
                let model = document.getElementById("modelInput").value;
                let year = document.getElementById("yearInput").value;
                let mileage = document.getElementById("mileageInput").value;
                if(this.checkInputs(matricule, brand, model, year, mileage)) {
                    this.sending = true;

                    VehicleService.add(this.clientId,matricule, brand, model, year, mileage, document.getElementById("fuelTypeSelect").value, this.newDate)
                        .then((res)=>{
                            this.refreshVehicles(res.data.vehicle, 'added');
                        })
                        .catch((err)=>{
                            console.log(err);
                            this.sending = false;
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Matricule already used',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                }
            },
            async refreshVehicles(vehic, title) {
                this.$emit('vehicle-emitted',vehic);
                this.sending = false;
                this.close();
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text: 'Vehicle '+title+' successfully',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000
                });
            },
            async editVehicle() {
                if (this.sending)
                    return;
                if(this.checkInputs(this.vehicle.matricule, this.vehicle.brand, this.vehicle.model, this.vehicle.year, this.vehicle.mileage)) {
                    this.sending = true;
                    VehicleService.update(this.vehic.id, this.vehicle.matricule, this.vehicle.brand, this.vehicle.model, this.vehicle.year, this.vehicle.mileage, document.getElementById("fuelTypeSelect").value, this.vehicle.lastOilChange)
                        .then((res) => {
                            this.refreshVehicles(res.data.vehicle, 'updated');
                        })
                        .catch((err) => {
                            console.log(err);
                            this.sending = false;
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Matricule already used',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                }
            },
        }
    }
</script>