<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">{{modalTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Label</label>
                    <input v-if="thisService" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisService.label" type="text" id="labelEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="labelInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Duration (Minutes)</label>
                    <input v-if="thisService" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisService.duration" type="number" id="durationEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="number" id="durationInput"  class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Price (DT)</label>
                    <input v-if="thisService" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisService.price" type="text" id="priceEdit"  class="form-control" />
                    <input v-else style="border: 1px solid darkgrey;border-radius: 5px" type="text" id="priceInput"  class="form-control" />
                </div>
            </div>
            <div class="dialog-footer">
                <button v-if="thisService" type="button" @click="editService()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button v-else type="button" @click="addService()" class="btn btn-info dialog-button" >
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
    import ServiceService from "../../services/ServiceService";
    export default {
        name: 'AddServiceDialog',
        props: {
            service: Object,
            modalTitle: String,
            show: Boolean,
        },
        mounted() {
            this.thisService = this.service;
        },
        data() {
            return {
                sending : false,
                thisService: null,
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            checkInputs(label, duration, price) {
                if(label.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Label required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(duration.length === 0 || isNaN(duration)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid duration',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(price.length === 0 || isNaN(price)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid price',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                return true;
            },
            async addService() {
                if (this.sending)
                    return;
                let label = document.getElementById("labelInput").value;
                let duration = document.getElementById("durationInput").value;
                let price = document.getElementById("priceInput").value;
                if(this.checkInputs(label, duration, price)) {
                    this.sending = true;
                    ServiceService.addService(label, price, duration)
                        .then((res)=>{
                            this.refreshServices(res.data.service, 'added');
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                }
            },
            async editService() {
                if (this.sending)
                    return;
                console.log(this.thisService);
                if(this.checkInputs(this.thisService.label, this.thisService.duration, this.thisService.price)) {
                    this.sending = true;
                    ServiceService.updateService(this.service.id,this.thisService.label, this.thisService.price, this.thisService.duration)
                        .then(()=>{
                            this.refreshServices(this.thisService, 'updated');
                        })
                        .catch((err)=>{
                            console.log(err);
                        })

                }
            },
            async refreshServices(service, title) {
                this.$emit('service-emitted',service);
                this.sending = false;
                this.close();
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text:'Service '+title+' successfully',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }
    }
</script>