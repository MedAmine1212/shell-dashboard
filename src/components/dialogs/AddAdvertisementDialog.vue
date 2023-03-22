<template>

    <div v-if="show && !loading" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div v-if="sending" style="margin-top: -16px;margin-left: -16px;display: flex;justify-content:center;z-index:9999;position: absolute;width: 100%;height: 100%; background-color: rgba(255,255,255,0.5)">
                <div style="margin-top: 100px;margin-left: 20px">
                    <div class="spinner-grow text-bg-warning" style="height: 70px;width: 70px" role="status"><span class="sr-only">Sending...</span></div><br>
                    <span style="margin-left: -20px">Uploading file...</span>
                </div>
            </div>
            <div class="dialog-header">
                <h5 class="dialog-title">Add a new advertisement</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Advertisement title</label>
                    <input style="border: 1px solid darkgrey;border-radius: 5px" v-model="advertisement.title" type="text" class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Type</label><br>
                    <div style="display: flex">
                    <div class="form-check" style="margin-right: 40px">
                        <input checked class="form-check-input" v-model="advertisement.isVideo" type="radio" :value="true" name="typeRadio" id="radio1"/>
                        <label class="form-check-label" for="radio1"> Video </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" v-model="advertisement.isVideo" type="radio" :value="false" name="typeRadio" id="radio2"/>
                        <label class="form-check-label" for="radio2"> Image </label>
                    </div>
                    </div>
                </div>
                <div class="mb-4">
                    <label>File (image or video)</label>
                    <input @change="onFileSelected" type="file" accept="image/png, image/gif, image/jpeg, video/mp4" id="advertisementFile" class="form-control">
                </div>
            </div>
            <div class="dialog-footer">
                <button :disabled="sending" type="button" @click="addAdvertisement()" class="btn btn-info dialog-button" >
                    Add
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
    import AdvertisementService from "../../services/AdvertisementService";
    export default {
        name: 'AddProductDialog',
        props: {
            show: Boolean,
        },
        mounted() {
                this.advertisement = {};
                this.advertisement.title = "";
                this.advertisement.isVideo = true;
                this.advertisement.file = "";
                this.loading =false;
        },
        data() {
            return {
                loading:true,
                file: null,
                sending : false,
                advertisement: null,
            };
        },
        methods: {
            onFileSelected(event) {
                this.file = event.target.files[0];
            },
            close() {
                this.$emit('close');
            },
            async addAdvertisement() {
                if (this.sending)
                    return;
                if(this.file == null) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Advertisement image or video required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return;
                }
                if(this.advertisement.isVideo) {
                    if(this.file.type.indexOf("video") === -1) {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Only MP4 file accepted for video upload',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        return;
                    }
                } else {
                    if(this.file.type.indexOf("image") === -1) {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'This is not a valid image file',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        return ;
                    }
                }
                if(this.advertisement.title.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Advertisement title required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return;
                }

                const formData = new FormData();
                formData.append("file", this.file);
                formData.append("title", this.advertisement.title);
                formData.append("isVideo", this.advertisement.isVideo);
                this.sending = true;
                AdvertisementService.addAdvertisement(formData)
                    .then((res)=>{
                        this.sending = false;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text: 'Advertisement image or video required',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.$emit('advertisement-added', res.data.advertisement);
                        this.close();
                    })

                    .catch((err)=> {
                        this.sending = false;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Error acquired please try again',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        });
                        console.log(err);
                    })
            },
        }
    }
</script>