<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">Adjust station stock</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div  class="form-outline mb-4">
                    <div style="width: 100%;text-align: center" class="form-label">Stock (<b>0</b> will remove this product from the station)</div>
                    <input v-model="stock" style="border: 1px solid darkgrey;border-radius: 5px" type="number" class="form-control" />
                </div>
            </div>
            <div class="dialog-footer">
                <button :disabled="sending" type="button" @click="adjustStock()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
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
    import ProductStationService from "../../services/ProductStationService";
    export default {
        name: 'AdjustStockDialog',
        props: {
            station: Object,
            product: Object,
            st:Number,
            show: Boolean,
        },
        mounted() {
            this.stock = this.st;
        },
        data() {
            return {
                sending: false,
                stock: 0,
            };
        },
        methods: {
            removeProduct(restore) {
                console.log(restore);
                ProductStationService.removeProductFromStation(this.product.product.id, this.station.id, restore)
                    .then(()=>{
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'product removed from station',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        this.sending = false;
                        this.$emit('removed');
                        this.close();
                    })
                    .catch((err)=>{
                        this.sending = false;
                        console.log(err);
                    })
            },
            adjustStock() {
                if(this.sending)
                    return;
                if(this.stock < 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid value',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return;
                }
                if(this.stock === 0) {
                    Swal.fire({
                        title: 'Restore product stock ?',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.isConfirmed) {
                          this.removeProduct(1);
                        } else {
                            this.removeProduct(0);
                        }
                    });
                } else {
                    ProductStationService.addProductToStation(this.product.product.id, this.station.id, this.stock-this.st, null)
                        .then(()=>{
                            this.sending = false;
                            this.$emit('stockUpdated', this.stock-this.st);
                            this.close();
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(19,150,71,0.8)",
                                color: "white",
                                text: 'Stock updated',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                        .catch((err)=>{
                            this.sending = false;
                            console.log(err);
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Insufficient product stock',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                }
                this.sending = true;
            },
            close() {
                this.$emit('close');
            }
        }
    }
</script>