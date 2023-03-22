<template>
    <div v-if="!loading" class="card advertisement">
        <div class="about-product text-center mt-2">
            <div>
                <div class="spinner-container" v-if="!ad.isLoaded">
                    <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                <div v-else>
                    <video style="border-radius: 10px" v-if="ad.isVideo" width="390" height="220" controls>
                        <source :src="ad.src" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <img style="border-radius: 10px" v-else :src="ad.src" height="220"/>
                </div>
                <br>
                <h4>{{ad.title}}</h4>
                <div v-if="!borne_id">
                <div class="d-flex justify-content-center" v-if="!sender" ><button :disabled="deleting" @click="deleteAd()" class="btn btn-danger">Delete</button></div>
                <div class="d-flex justify-content-center" v-else><button :disabled="deleting" @click="removeAdFromBorne()" class="btn btn-danger">Remove from borne</button></div>
                </div>
                <div v-else>
                    <div class="d-flex justify-content-center" v-if="!sender" ><button :disabled="deleting" @click="addAddToBorne()" class="btn btn-success">Add this ad</button></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

    import Swal from 'sweetalert2'
    import AdvertisementService from "../../services/AdvertisementService";
    export default {

        name: 'SingleAd',
        props: {
            sender: String,
            advertisement:Object,
        },
        mounted() {
            this.ad = this.advertisement;
            this.ad.src = process.env.VUE_APP_API_BASE_URL+'ads/'+this.ad.file;
            this.ad.isLoaded = true;
            this.loading = false;
            if(this.$route.params.bId != 0 && !isNaN(this.$route.params.bId ))
                this.borne_id = this.$route.params.bId;
        },
        components: {
        },
        data() {
            return {
                borne_id: null,
                ad: null,
                deleting: false,
                loading: true,
            };
        },
        methods: {
            addAddToBorne() {
                this.deleting = true;
                AdvertisementService.addAdToBorne(this.advertisement.id, this.borne_id)
                    .then(()=>{
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text:'Advertisement added to borne successfully',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.$emit('ad-deleted',this.ad);
                    })
            },
            removeAdFromBorne() {
                this.$emit("remove-ad", this.advertisement);
                this.deleting = true;
            },
            deleteAd() {
                this.deleting = true;
                Swal.fire({
                    title: 'Are you sure you want to delete this advertisement ?',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.deleting = true;
                        AdvertisementService.delete(this.ad.id)
                            .then(()=>{
                                this.deleting = false;
                                this.$emit('ad-deleted',this.ad);
                            })
                    }
                });
            } ,
        }
    }
</script>

<style>
    .card {
        width: 300px;
        height: 340px;
    }

</style>