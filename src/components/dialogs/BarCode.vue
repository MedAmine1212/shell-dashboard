<template>
    <div @click="focusOnInput()" v-if="show" class="dialog-container">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">Set client barcode</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body" style="text-align: center">
                <div style="display:flex;justify-content: center">
                    <img width="120" src="../../assets/images/barcode-scan.gif">
                </div><br>
                <span >SCAN THE <b>BARCODE</b> ON THE <b>CLIENT CARD</b> <br><hr><b>OR</b><br> INPUT THE CODE HERE</span>
                <input @keyup.enter="setBarCode" :disabled="sending" type="text" class="form-control loginInput" v-model="barCode" style="height: 60px;font-size: 35px" id="barCodeInput" placeholder="BARCODE">
            </div>
            <div class="dialog-footer">
                <button :disabled="sending" @click="setBarCode()" type="button" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button :disabled="sending" type="button" class="btn btn-danger dialog-button" @click="close()">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>


<script>
    import Swal from 'sweetalert2'
    import ClientService from "../../services/ClientService";
    export default {
        name: 'BarCode',
        components: {
        },
        props: {
            user: Object,
            show: Boolean,
        },
        mounted() {
            this.thisUser = this.user;
            document.getElementById("barCodeInput").focus();
        },
        data() {
            return {
                barCode: "",
                sending : false,
                thisUser: null,
            };
        },
        methods: {
            focusOnInput() {
                if(document.getElementById("barCodeInput"))
                    document.getElementById("barCodeInput").focus();
            },
            close() {
                if(!this.sending)
                    this.$emit('close');
            },
            async setBarCode() {
                if(this.sending)
                    return;

                if(isNaN(this.barCode) || this.barCode.length<4) {
                   await Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid barcode',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    this.barCode = "";
                    this.focusOnInput();
                    return;
                }
                this.sending = true;
                ClientService.validateClient(this.user.id, this.barCode)
                    .then(()=>{
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(19,150,71,0.8)",
                            color: "white",
                            text: 'Client validated',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.sending = false;
                        // eslint-disable-next-line vue/no-mutating-props
                        this.user.user.barCode = this.barCode;
                        // eslint-disable-next-line vue/no-mutating-props
                        this.user.validated = true;
                        this.$emit('user-emitted',this.user);
                        this.close();
                    })
                    .catch(async ()=>{
                        this.sending = false;
                        await Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Barcode already assigned',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.barCode = "";
                        this.focusOnInput();
                    })
            }
        }
    }
</script>