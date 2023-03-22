<template>
    <div>
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div  v-else>
        <div class="header-container">
            <button v-if="!borne_id" type="button" @click="showModal = true" style="float: right;margin-right: 60px" title="Add product" class="btn btn-warning"><i class="fas fa-plus"></i></button>
            <button @click="backToBorne()" v-else type="button" style="float: right;margin-right: 60px" class="btn btn-success">Done</button>
            <div style="display: flex">
                <h2 style="margin-left: 10px"><b>Advertisements</b></h2>
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
        <div class="ads-container" v-if="ads.length">
        <single-ad @ad-deleted="deleteAd" v-for="ad in adsList" :key="ad.id" :advertisement="ad"></single-ad>
        </div>
            <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
                No ads to show
            </div>
        </div>
        <add-advertisement-dialog v-if="showModal"
                                  @advertisement-added ="addAdvertisement"
                                  @close="showModal = false"
                                  :show.sync="showModal"
                                    ></add-advertisement-dialog>
    </div>
</template>

<script>
    import AdvertisementService from "../../services/AdvertisementService";
    import AddAdvertisementDialog from "../dialogs/AddAdvertisementDialog";
    import router from "@/router";
    import SingleAd from "./SingleAd";
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Ads',
        components: {
           SingleAd,
          AddAdvertisementDialog,
        },
        computed: {
            adsList() {
                return this.ads.filter((ad) => ad.title.toLowerCase().includes(this.searchValue.trim().toLowerCase()));
            }
        },
        data() {
            return {
                searchValue: "",
                borne_id: null,
                showModal: false,
                deleting:false,
                ads:[],
                loading:true,
            };
        },
        methods: {
        backToBorne() {
            window.localStorage.setItem("BORNE_ID",this.borne_id);
            router.push({name: "bornes" ,params: { id: this.$route.params.sId}} );
        },
        deleteAd(ad) {
            this.ads.splice(this.ads.indexOf(ad),1);
            if(this.ads.length === 0 &&  this.borne_id != null) {
                this.backToBorne();
            }
        },
        addAdvertisement(advertisement) {
            this.ads.push(advertisement);
            advertisement.src = process.env.VUE_APP_API_BASE_URL+'ads/'+advertisement.file;
            advertisement.isLoaded = true;
        }

        },
        created() {
           if(this.$route.params.bId != 0 && !isNaN(this.$route.params.bId ))
                this.borne_id = this.$route.params.bId;
            AdvertisementService.getAllAds()
                .then( async (res)=>{
                    this.ads = res.data.advertisements;
                    console.log(this.ads);
                    this.loading = false;
                });
        }
   }
</script>

<style>
    .advertisement {
        width: 420px;height: 360px;margin: 20px;
    }
</style>