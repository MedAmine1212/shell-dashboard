<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div style="max-width: 80%" class="dialog-box">
        <div class="dialog-header">
            <h5 class="dialog-title">Add products to {{station.label}}</h5>
            <button type="button" class="dialog-close" @click="close()">
                &times;
            </button>
        </div>

            <div style="overflow-y: auto;max-height: 600px;overflow-x: hidden" class="dialog-body">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else-if="products.length">
                <div class="products" >
                    <div v-for="product in products" :key="product.id">
                        <span v-if="!addingProduct" @click="addProductToStation(product)" style="z-index:999;height:20px ;cursor: pointer;position: absolute;margin-top: 20px;margin-left: 250px" title="Add product to station" class="badge badge-success"><i class="fas fa-check-double"></i></span>

                        <single-product    :sender="'station'"  :prod="product"></single-product>
                    </div>

                </div>
        </div>
                <div style="margin-top: 50px" v-else class="text-gray-600 text-center py-16">
                    No available product to add
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import SingleProduct from "../dashboard/SingleProduct";
    import ProductStationService from "../../services/ProductStationService";
    import Swal from 'sweetalert2'
    import ProductService from "../../services/ProductService";
    export default {
        name: 'AvailableProductsToAdd',
        components: {
            SingleProduct,
        },
        props: {
            station:Object,
            show: Boolean,
        },
        data() {
            return {
                addingProduct: false,
                loading: true,
                products: [],
            };
        },
        methods: {
            addProductToStation(product) {
                Swal.fire({
                    title: "Product price & stock",
                    html:
                        '<br><div><div>Price (DT)</div><input id="swal-input1" value="'+product.price+'" class="swal2-input">' +
                        '<br><br><div>Stock</div><input id="swal-input2" type="number" value="1" class="swal2-input"> </div>',
                    showCancelButton: true,
                }).then((result)=> {
                    if (result.isConfirmed) {
                        if (isNaN(document.getElementById('swal-input2').value) || document.getElementById('swal-input2').value.length === 0 || document.getElementById('swal-input2').value == 0) {
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Invalid stock value',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            return;
                        }
                        if(isNaN(document.getElementById('swal-input1').value) || document.getElementById('swal-input1').value.length === 0) {
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Invalid price value',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            return;
                        }
                        this.addingProduct = true;
                        ProductStationService.addProductToStation(product.id, this.station.id, document.getElementById('swal-input2').value, document.getElementById('swal-input1').value)
                            .then((res) => {
                                this.addingProduct = false;
                                this.products.splice(this.products.indexOf(product), 1);
                                this.$emit('add-product', res.data.productStation);
                                Swal.fire({
                                    position: 'bottom-right',
                                    background: "rgba(19,150,71,0.8)",
                                    color: "white",
                                    text: 'Product added successfully',
                                    timerProgressBar: true,
                                    showConfirmButton: false,
                                    timer: 1000
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                this.addingProduct = false;
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
                });
            },
            addEmp(user) {
                this.$emit('add-emp', user);
            },
            close() {
                console.log(this.station);
                this.$emit('close');
            },
        },
        async created() {
            ProductService.findAvailableProductsToAdd(this.station.id)
                .then((res)=>{
                    this.products = res.data.products;
                    this.loading = false;
                })
                .catch((err)=>{
                    console.log(err);
                })
        }
    }
</script>