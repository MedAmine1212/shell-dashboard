<template>
    <div>
        <div v-if="!loading" class="header-container">
            <button type="button" @click="showModal = true" style="float: right;margin-right: 60px" title="Add station" class="btn btn-warning"><i class="fas fa-plus"></i></button>
           <div style="display: flex">
               <h2 style="margin-left: 10px"><b>Stations</b></h2>
               <div v-if="!loading" style="width: 400px;margin-left: 40px" class="d-none d-md-flex input-group w-auto my-auto">
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
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="stations.length" class="station-container">
            <div class="stations" v-for="station in stationsList" :key="station.id">
                    <img width="300" class="stationImage"  src="./../../assets/images/station.png">
                    <h5 style="margin-top: -5px">{{station.label}}</h5>
                <div style="width: 100%;display: flex;justify-content: center">
                    <router-link :to="`/dashboard/bornes/${station.id}`">
                        <span style="cursor: pointer;width: 80px" class="badge badge-warning">Details</span>
                    </router-link></div>
            </div><br>
        </div>

        <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
            No Station to show
        </div>
        <span v-if="!loading && pages > 1">
        <div v-if="stations.length" style="width: 100% !important;display:flex;justify-content: center">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage <= 1 }">
                    <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
                </li>
                <li class="page-item" v-for="page in pages" :key="page" :class="{ active: page === currentPage }">
                    <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage >= pages }">
                    <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                </li>
            </ul>
        </div>
    </span>


        <!--Add a new station modal-->
        <div v-if="showModal" class="dialog-container" :class="{ 'd-none': !showModal }">
            <div class="dialog-box">
                <div class="dialog-header">
                    <h5 class="dialog-title">Add a new station</h5>
                    <button type="button" class="dialog-close" @click="showModal = false">
                        &times;
                    </button>
                </div>
                <div class="dialog-body">
                    <div style="margin-top: 10px;display: flex;width: 100%">
                        <input id="stationName" style="width: 85%" type="text" class="form-control" placeholder="Station name here">
                        <div title="Required"  style="color: #FF141E;margin-left: 5px;margin-top: 5px"><i class="fas fa-exclamation-circle"></i></div>
                    </div><br>
                    <div style="margin-top: 10px;display: flex;width: 100%">
                        <input id="stationAddress" style="width: 85%" type="text" class="form-control" placeholder="Station address here">
                        <div title="Required"  style="color: #FF141E;margin-left: 5px;margin-top: 5px"><i class="fas fa-exclamation-circle"></i></div>
                    </div><br>
                    <hr>
                    <div style="display: flex"><label>Station image</label></div>
                    <div style="margin-top: 10px;display: flex;width: 100%">
                        <input type="file" accept="image/png, image/gif, image/jpeg" class="form-control" style="width: 85%">
                    </div>
                </div>
                <div class="dialog-footer">
                    <button :disabled="sending" type="button" @click="addStation()" class="btn btn-info dialog-button" >
                        Add
                    </button>
                    <button type="button" class="btn btn-danger dialog-button" @click="showModal = false">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import StationService from "../../services/StationService";
    import Swal from 'sweetalert2'
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Stations',
        data() {
            return {
                searchValue: "",
                showModal: false,
                currentPage:1,
                sending: false,
                pages: 0,
                itemsPerPage: 12,
                stations: [],
                loading: true,
            };
        },
        computed: {
           stationsList() {
                let sts = this.stations.filter((station)=> station.label.toLowerCase().includes(this.searchValue.trim().toLowerCase()));
               const startIndex = (this.currentPage - 1) * this.itemsPerPage;
               // slice the stations array to get only the items for the current page
               return sts.slice(startIndex, startIndex + this.itemsPerPage);
           },

        },
        methods: {
           async addStation() {
               if(this.sending)
                   return;
             let name = document.getElementById("stationName").value;
             let address = document.getElementById("stationAddress").value;
             if(name.length < 5) {
                 Swal.fire({
                     position: 'bottom-right',
                     background: "rgba(228,161,27,0.8)",
                     color: "white",
                     text: 'Station name required (Minimum 5 letters)',
                     timerProgressBar: true,
                     showConfirmButton: false,
                     timer: 1500
                 });
                 return;
             }
             if(address.length === 0) {
                 Swal.fire({
                     position: 'bottom-right',
                     background: "rgba(228,161,27,0.8)",
                     color: "white",
                     text: 'Station address required',
                     timerProgressBar: true,
                     showConfirmButton: false,
                     timer: 1500
                 });
                 return;
             }
             // get station Admin and work schedule

               this.sending = true;
               StationService.addStation(name, address)
                   .then((response) => {

                       document.getElementById("stationName").value = "";
                       document.getElementById("stationAddress").value = "";
                       this.stations.push(response.data.Station);
                       this.pages = Math.ceil(this.stations.length / this.itemsPerPage);
                       Swal.fire({
                           position: 'bottom-right',
                           background: "rgba(19,150,71,0.8)",
                           color: "white",
                           text: 'Station added successfully',
                           timerProgressBar: true,
                           showConfirmButton: false,
                           timer: 1000
                       });
                       this.sending = false;
                       this.showModal = false;

                   })
                   .catch((error) => {
                       this.sending = false;
                       console.error(error);
                   });
           },
            setPage(pageNumber) {
                // set the current page to the given page number
                this.currentPage = pageNumber;
            },
            prevPage() {
                // move to the previous page
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            nextPage() {
                // move to the next page
                if (this.currentPage < this.pages) {
                    this.currentPage++;
                }
            }
        },
        async created() {
            // calculate the total number of pages based on the number of items per page
            await StationService.findAll()
                .then(async (response) => {
                    this.stations = response.data.Stations;
                    this.pages = Math.ceil(this.stations.length / this.itemsPerPage);
                    this.loading = false;
                })
                .catch((error) => {
                    console.log(error)

                });
        },
   }
</script>

