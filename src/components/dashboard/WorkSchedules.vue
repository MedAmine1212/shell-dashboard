<template>

    <div>
        <button v-if="!loading" type="button" @click="newWorkSchedule()" style="float: right;margin-right: 40px" title="Add station admin" class="btn btn-warning"><i class="fas fa-plus"></i></button>

        <div v-if="!loading" class="clients-header">
            <h1>Work schedules</h1>
        </div>
        <hr v-if="!loading" style="border: 1px solid black">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else>
            <div v-if="workSchedules.length" >
            <single-work-schedule @workSchedule-deleted="deleteWorkSchedule" style="width: 100%" v-for="schedule in paginatedWorkSchedule" :key="schedule.id" :ws="schedule" :sender="'old'"></single-work-schedule>
            </div>
            <div style="margin-top: 200px" v-else class="text-gray-600 text-center py-16">
                No work schedules to show
            </div>
            <span v-if="!loading && pages > 1">
        <div v-if="workSchedules.length" style="width: 100% !important;display:flex;justify-content: center">
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
        </div>

        <add-work-schedule-dialog v-if="showModal"
                              @workSchedule-emitted="addWorkSchedule"
                             :show.sync="showModal"
                              :modalTitle="modalTitle"
                             @close="showModal=false"
        ></add-work-schedule-dialog>
    </div>


</template>

<script>
    import WorkScheduleService from "../../services/WorkScheduleService";
    import SingleWorkSchedule from "./SingleWorkSchedule";
    import Swal from 'sweetalert2'
    import AddWorkScheduleDialog from "../dialogs/AddWorkScheduleDialog";
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'WorkSchedules',
        components: {
           AddWorkScheduleDialog,
          SingleWorkSchedule,
        },
        data() {
            return {
                showModal: false,
                modalTitle: "",
                workSchedules: [],
                loading: true,
                pages: 0,
                itemsPerPage: 1,
                currentPage:1,
            }
            },
        computed : {
            paginatedWorkSchedule() {
                // calculate the index of the first item on the current page
                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                // slice the stations array to get only the items for the current page
                return this.workSchedules.slice(startIndex, startIndex + this.itemsPerPage);
            },
        },
        methods: {
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
            },
        deleteWorkSchedule(workSchedule) {
            this.workSchedules.splice(this.workSchedules.indexOf(workSchedule),1);
            this.pages = Math.ceil(this.workSchedules.length / this.itemsPerPage);
            if(this.pages > 1) {
                if(this.currentPage === 1) {
                    this.currentPage++;
                } else {
                    this.currentPage--;
                }
            }
            Swal.fire({
                position: 'bottom-right',
                background: "rgba(19,150,71,0.8)",
                color: "white",
                text: 'Work schedule deleted successfully',
                timerProgressBar: true,
                showConfirmButton: false,
                timer: 1500
            });
        },
        addWorkSchedule(workSchedule) {
            this.workSchedules.push(workSchedule);
            this.pages = Math.ceil(this.workSchedules.length / this.itemsPerPage);
            this.currentPage = this.pages;
        },
       async newWorkSchedule() {
        this.showModal = true;
        this.modalTitle = "Add new work schedule";
        }
        },
        async created() {
           WorkScheduleService.findAll()
               .then((res)=>{
                   this.workSchedules = res.data.workSchedules;
                   this.pages = Math.ceil(this.workSchedules.length / this.itemsPerPage);
                   this.loading =false;
               })
               .catch((err)=>{
                   console.log(err);
               });
        }
   }
</script>
