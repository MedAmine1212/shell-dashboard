<template>
    <div v-if="show" class="dialog-container">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">Set client barcode</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body" style="text-align: center">

                <div v-if="loading" class="spinner-grow text-warning" role="status"><span class="sr-only">Loading...</span></div>
                <div style="display:flex;justify-content: center">
                    <div :class="{ 'd-none': loading || sending }">
                    <hr class="barcodeHr">
                    <div id="interactive">
                    </div>
                    </div>
                    <div v-if="sending" class="spinner-grow text-warning" role="status"><span class="sr-only">Sending...</span></div>
                </div><br>

                <span v-if="!loading">SCAN THE <b>BARCODE</b> ON THE <b>CLIENT CARD</b> <br><hr><b>OR</b><br> INPUT THE CODE HERE</span>
                <input :disabled="sending" v-if="!loading" type="text" class="form-control loginInput" v-model="barCode" style="height: 60px;font-size: 35px" id="barCodeInput" placeholder="BARCODE">
            </div>
            <div v-if="!loading" class="dialog-footer">
                <button :disabled="sending" @click="setBarCode()" type="button" class="btn btn-info dialog-button" >Save
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
    import Quagga from 'quagga';
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
            const vm = this;
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    target: document.getElementById('interactive'),
                    constraints: {
                        width: 640,
                        height: 480,
                        facingMode: "environment" // or "user" for front camera
                    }
                },
                decoder : {
                    readers : ["ean_reader", "code_128_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader", "i2of5_reader", "2of5_reader", "code_93_reader"]
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    return
                }
                vm.loading = false;
                Quagga.start();
                Quagga.onDetected((data)=>{
                    if(data) {
                        vm.barCode = "";
                        vm.barCode = data.codeResult.code;
                    }
                })
            });
        },
        data() {
            return {
                loading: true,
                barCode: "",
                sending : false,
                thisUser: null,
            };
        },
        methods: {
            close() {
                if(!this.sending)
                    this.$emit('close');
            },
            setBarCode() {
                if(this.sending)
                    return;
                if(isNaN(this.barCode) || this.barCode.length<4) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid barcode',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
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
                    .catch((error)=>{
                        this.sending = false;
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Barcode already assigned',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        console.log(error);
                    })
            }
        }
    }
</script>