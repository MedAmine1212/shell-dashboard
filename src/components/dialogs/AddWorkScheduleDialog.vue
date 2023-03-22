<template>

    <div v-if="show && !loading" class="dialog-container" :class="{ 'd-none': !show }">
        <div style="max-width: 70%;max-height: 700px !important;" class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">{{modalTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div style="max-height: 550px;overflow-y: auto" class="dialog-body">
                <single-work-schedule @workSchedule-emitted="addWorkSchedule" style="width: 100%" :ws="workSchedule" :sender="'new'"></single-work-schedule>
            </div>
            <div class="dialog-footer">
                <button type="button" class="btn btn-danger dialog-button" @click="close()">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
    import SingleWorkSchedule from "../dashboard/SingleWorkSchedule";
    import Swal from 'sweetalert2'
    export default {
        name: 'AddWorkScheduleDialog',
        props: {
            modalTitle: String,
            show: Boolean,
        },
        components: {
            SingleWorkSchedule,
        },
        mounted() {
            this.workSchedule = {};
            this.workSchedule.id = -1;
            this.workSchedule.minimumConsultationTime = 30;
            this.workSchedule.working_days = [];
            for(let i=0;i<this.days.length;i++) {
                let day = {};
                day.id = -1;
                day.day = this.days[i];
                day.shiftStart = "08:00";
                if(i <5) {
                    day.shiftEnd = "17:00";
                    day.pauseStart = "12:00";
                    day.pauseEnd = "13:00";
                    day.pause = true;
                } else {
                    day.pause = false;
                    day.shiftEnd = "13:00";
                }
                day.working = i < 6;
                this.workSchedule.working_days.push(day);
                if(i ===6) {
                    this.loading = false;
                }
            }
        },
        data() {
            return {
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                workSchedule: null,
                loading: true,
            };
        },
        methods: {
            close() {
                this.$emit('close');
            },
            addWorkSchedule(workSchedule){
                this.$emit('workSchedule-emitted',workSchedule);
                this.close();
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text: 'Work schedule added successfully',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
        }
    }
</script>