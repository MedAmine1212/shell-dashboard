<template>
    <div v-if="!loading">
        <div style="display: flex;height: 40px">
            <h4 style="height: 40px;width: 100%">
                <span v-if="schedule.id !== -1">Schedule {{schedule.id}}</span><span v-else>New schedule</span>
            </h4><br>
            <div v-if="sending" class="spinner-grow text-bg-warning" style="height: 30px;width: 35px;margin-left: 20px;margin-right: 70px;margin-top:5px" role="status"><span class="sr-only">Sending...</span></div>
            <button @click="deleteWorkSchedule()" style="float:right;margin-right: 70px" title="Delete" :disabled="sending" v-if="sender === 'old' && !station_id" class="btn btn-danger"><i class="fas fa-trash"></i></button>
            <button @click="assignScheduleToStation(schedule.id)" style="float:right;margin-right: 70px" title="Assign" v-if="sender === 'old' && station_id != null && !isNaN(station_id)" :disabled="sending" class="btn btn-success"><i class="fas fa-check-double"></i></button>

        </div>

        <div style="display: flex">
            <h6>Minimun consultation time:</h6>
                <input :disabled="!editMinimum && sender ==='old'" type="number" class="form-control" style="width:70px;margin-left: 20px;margin-top: -10px;margin-right: 10px" v-model="schedule.minimumConsultationTime"/>
            <span>Minutes</span>
            <span @click="editMinimum = true" style="margin-left: 5px;cursor: pointer" title="Edit Minimun consultation time" class="badge badge-warning"><i class="fas fa-edit"></i></span>
            <button @click="saveMinimumConsultationTime()" style="position: absolute; left: 48%;margin-top: -10px" title="Save changes" :disabled="sending" v-if="editMinimum && sender !== 'new'" class="btn btn-success"><i class="fas fa-check"></i></button>
          </div>
        <br>
        <table class="table" style="width: 90%">
            <thead>
            <tr>
                <th style="width: 20px;" scope="col">Working</th>
                <th scope="col">Day</th>
                <th scope="col">Shift start</th>
                <th scope="col">Shift end</th>
                <th style="width: 20px" scope="col">Pause</th>
                <th scope="col">pause start</th>
                <th scope="col">pause end</th>
            </tr>
            </thead>
            <tbody>
    <tr v-for="day of schedule.working_days" :key="day.id">
        <td style="width: 20px;">
            <div class="form-check">
                <input @change="changeWorkingStatus(day)" :disabled="sending" class="form-check-input" type="checkbox" :id="'working'+day.id" :checked="day.working" />
            </div>
        </td>
        <td>{{day.day}}</td>
        <td><input @input="day.changed = true" :disabled="!day.working || sending" v-model="day.shiftStart" class="form-control text-success" style="width: 70px"/></td>
        <td><input @input="day.changed = true" :disabled="!day.working  || sending" v-model="day.shiftEnd" class="form-control text-success" style="width: 70px"/></td>
        <td>
            <div class="form-check">
                <input @change="changePauseStatus(day)" :disabled="sending || !day.working" class="form-check-input" type="checkbox" :id="'pause'+day.id" :checked="day.pause" />
            </div>
        </td>
        <td><input @input="day.changed = true" :disabled="!day.working  || sending || !day.pause" v-model="day.pauseStart" class="form-control text-warning" style="width: 70px"/></td>
        <td style="width:200px">
            <div style="display: flex">
                <input @input="day.changed = true" :disabled="!day.working  || sending || !day.pause" v-model="day.pauseEnd" class="form-control text-warning" style="width: 70px;margin-right: 10px"/>
                <div style="width: 100px">
                    <button title="Save changes" @click="saveChanged(day), day.changed = false" :disabled="sending" v-if="day.changed && sender !== 'new'" class="btn btn-success"><i class="fas fa-check"></i></button>
                </div>
            </div>
        </td>
    </tr>
            </tbody>
        </table>
        <hr v-if="sender === 'old'">

        <button @click="addNewWorkSchedule()" :disabled="sending" class="btn btn-success" style="position: fixed;z-index: 999;top: 89.1%;left:71%;height: 40px" v-if="sender === 'new'">Save</button>
    </div>
</template>
<script>

    import Swal from 'sweetalert2'
    import WorkScheduleService from "../../services/WorkScheduleService";
    import router from "@/router";
    export default {

        name: 'SingleWorkSchedule',
        props: {
            ws:Object,
            sender:String,
        },
        components: {
        },
        mounted() {
        this.schedule = this.ws;
        this.loading = false;
        if(this.$route.params.id != 0 && !isNaN(this.$route.params.id )) {
            this.station_id = this.$route.params.id;
        }
        },
        data() {
            return {
                station_id: null,
                editMinimum: false,
                schedule :null,
                loading: true,
                sending: false,
                timeRegex: /^(0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            };
        },
        methods: {
            assignScheduleToStation(schedule_id) {
                this.sending = true;
                WorkScheduleService.assignScheduleToStation(this.station_id, schedule_id)
                    .then(()=>{
                        this.sending = false;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text:"Work schedule set successfully",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        router.push({name: "bornes",  params: { id: this.station_id } });
                        this.sending = false;
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            deleteWorkSchedule() {
                Swal.fire({
                    title: 'Are you sure you want to delete this work schedule ?',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.sending = true;
                        WorkScheduleService.delete(this.schedule.id)
                            .then(()=>{
                                this.sending = false;
                                this.$emit('workSchedule-deleted',this.schedule);
                            })
                            .catch((err)=>{
                                console.log(err);
                            })
                    }
                });
            },
            saveMinimumConsultationTime() {
                if(isNaN(this.schedule.minimumConsultationTime) || this.schedule.minimumConsultationTime < 15 || this.schedule.minimumConsultationTime > 120) {
                    this.fireError("Minimum consultation time must be between 15 and 120");
                    return;
                }
                this.sending = true;
                WorkScheduleService.updateMinimumConsultationTime(this.schedule.id, this.schedule.minimumConsultationTime)
                    .then(()=>{
                        this.sending = false;
                        this.editMinimum = false;
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            addNewWorkSchedule() {
                if(isNaN(this.schedule.minimumConsultationTime) || this.schedule.minimumConsultationTime < 15 || this.schedule.minimumConsultationTime > 120) {
                    this.fireError("Minimum consultation time must be between 15 and 120");
                    return;
                }
              for(let i=0;i<this.schedule.working_days.length;i++){
                  let d = {...this.schedule.working_days[i]};
                  d = this.validateDay(d);
                  if(d == null) {
                      return;
                  } else
                  this.schedule.working_days[i] = d;
                  }
              this.sending = true;
              WorkScheduleService.addWorkSchedule(this.schedule)
                  .then((res)=>{
                      this.sending = false;
                      this.$emit('workSchedule-emitted',res.data.workSchedule);
                      if(this.$route.params.id !== 0) {
                          this.assignScheduleToStation(res.data.workSchedule.id);
                      }
                  })
                  .catch((err)=>{
                      console.log(err);
                  })
              },
            fireError(text) {
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(228,161,27,0.8)",
                    color: "white",
                    text: text,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            fixInput(time) {
                let [hour, minute] = time.split(":");
                hour = hour.padStart(2, "0"); // add a leading zero if the hour is a single digit
                minute = minute.padStart(2, "0"); // add a leading zero if the hour is a single digit
                return`${hour}:${minute}`;
            },
            validateDay(day) {
                try {
                    day.shiftStart = this.fixInput(day.shiftStart);
                    if(!this.timeRegex.test(day.shiftStart)) {
                        this.fireError("Invalid shift start value on "+day.day);
                        return null;
                    }
                } catch (e) {
                    this.fireError("Invalid shift start value on "+day.day);
                    return null;
                }
                try {
                    day.shiftEnd = this.fixInput(day.shiftEnd);
                    if(!this.timeRegex.test(day.shiftEnd)) {
                        this.fireError("Invalid shift end value on "+day.day);
                        return null;
                    }
                } catch (e) {
                    this.fireError("Invalid shift end value on "+day.day);
                    return null;
                }
                if(day.shiftStart > day.shiftEnd) {
                    this.fireError("Shift end cannot be before shift start on "+day.day);
                    return null;
                }
                if(day.pause) {
                    try {
                        day.pauseStart = this.fixInput(day.pauseStart);
                        if(!this.timeRegex.test(day.pauseStart)) {
                            this.fireError("Invalid pause start value on "+day.day);
                            return null;
                        }
                    } catch (e) {
                        this.fireError("Invalid pause start value on "+day.day);
                        return null;
                    }
                    try {
                        day.pauseEnd = this.fixInput(day.pauseEnd);
                        if(!this.timeRegex.test(day.pauseEnd)) {
                            this.fireError("Invalid pause end value on "+day.day);
                            return null;
                        }
                    } catch (e) {
                        this.fireError("Invalid pause end value on "+day.day);
                        return null;
                    }

                    if(day.pauseStart > day.pauseEnd) {
                        this.fireError("Pause end cannot be before pause start on "+day.day);
                        return null;
                    }
                    if(day.pauseStart < day.shiftStart || day.pauseStart > day.shiftEnd || day.pauseEnd > day.shiftEnd) {
                        this.fireError("Pause time should be between shift start and shift end on "+day.day);
                        return null;
                    }
                } else {
                    day.pauseStart = null,
                    day.pauseEnd = null;
                }
                return  day;
            },
            async saveChanged(day) {
                day = this.validateDay(day);
                if(day !== null) {
                this.sending = true;
                WorkScheduleService.updateWorkingDay(day.id, day)
                    .then(()=>{
                        this.sending = false;
                    })
                    .catch((err)=>{
                        console.log(err);
                        this.sending = false;
                        this.fireError("Error, please try again");
                    });
                }
            },
            changeWorkingStatus(day) {
                day.working = !day.working;
                if(this.sender === "new")
                    return;
                this.sending = true;
                WorkScheduleService.changeWorkingStatus(day.id, day.working)
                    .then(()=>{
                        this.sending = false;
                    })
                    .catch((err)=>{
                        console.log(err);
                        this.fireError("Error, please try again");
                        this.sending = false;
                    })
            },
            changePauseStatus(day) {
                day.pause = !day.pause;
                if(this.sender === "new")
                    return;
                this.sending = true;
                WorkScheduleService.changePauseStatus(day.id, day.pause)
                    .then(()=>{
                        this.sending = false;
                    })
                    .catch((err)=>{
                        console.log(err);
                        this.fireError("Error, please try again");
                        this.sending = false;
                    })
            }
        }
    }
</script>
