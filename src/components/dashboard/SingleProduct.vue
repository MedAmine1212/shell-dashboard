<template>
    <div v-if="!loading" style="margin: 5px">
        <div :class="{ 'long-card': station }"  class="card p-3 bg-white">
            <div class="about-product text-center mt-2">

                <div  v-if="!sending && !stationStock && !sender" style="position: absolute;top:10px;width: 100px;left: 69%">
                <span @click="selectedProduct = {...product}, showModal= true" style="cursor: pointer;font-size: 15px" title="Edit" class="badge badge-success"><i class="fas fa-edit"></i></span>
                <span @click="showConfirmationDialog = true" style="cursor: pointer;font-size: 15px" title="Delete" class="badge badge-danger"><i class="fas fa-trash"></i></span>
                </div>
                <div style="height:70px;margin-top: -19px;margin-bottom: 35px">
                <div class="spinner-container" v-if="imageLoading">
                    <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
                </div>
                    <img v-else :src="image" height="130"/>
                </div>
                <div><br>
                    <h4>{{product.label}}</h4>
                    <h6 class="mt-0 text-black-50">{{product.description}}</h6>
                </div>
            </div>
            <div class="stats mt-2">
                <div style="margin-bottom: 10px" class="d-flex justify-content-between p-price"><span>Stock</span><span class="badge" style="width: 50px;height: 30px"  :class="{ 'badge-success': product.stock >= 10, 'badge-warning' : product.stock < 10}"  v-if="product.stock">{{product.stock}}</span><span v-else class="badge badge-danger">OUT OF STOCK</span></div>

                <div v-if="stationStock && !sender" style="margin-bottom: 10px" class="d-flex justify-content-between p-price">
                    <span>Station stock</span>
                    <div  v-if="!sending && stationStock">
                        <button @click="showAdjustStock = true" style="border: none;cursor: pointer;font-size: 15px" title="Adjust stock" class="badge badge-warning"><i class="fas fa-exchange-alt"></i></button>
                    </div>
                    <div style="width: 50px;height: 30px" class="badge"  :class="{ 'badge-success': stationStock >= 10, 'badge-warning' : stationStock < 10}" v-if="stationStock">
                        {{stationStock}}
                    </div>
                    <span v-else class="badge badge-danger">
                        OUT OF STOCK
                    </span>
                </div>
            </div>

            <div class="d-flex justify-content-between p-price"><span><span v-if="station">Initial </span>Price</span><span>{{product.price}}DT</span></div>
            <br>
            <div v-if="station" class="d-flex justify-content-between p-price"><span>Price in this station</span><span>{{prod.price}}DT</span></div>
        </div>
        <ConfirmationDialog :confirmationDialogTitle="'product'"
                            :show.sync="showConfirmationDialog"
                            @confirm="deleteProduct()"
                            @close="showConfirmationDialog=false"
                            ref="confirmationDialog"></ConfirmationDialog>

        <add-product-dialog v-if="showModal"  :modalTitle="'Add product'"
                            :show.sync="showModal"
                            @update-emitted="updateProduct"
                            :product="selectedProduct"
                            @close="showModal=false"
                            ref="AddUserDialog" ></add-product-dialog>

        <adjust-stock-dialog v-if="showAdjustStock"
                            :show.sync="showAdjustStock"
                            :station="station"
                            :product="prod"
                            :st="stationStock"
                             @removed="removeProduct"
                             @stockUpdated="updateStock"
                            @close="showAdjustStock=false"
                            ></adjust-stock-dialog>
    </div>
</template>
<script>

    import ProductService from "../../services/ProductService";
    import ConfirmationDialog from "../dialogs/ConfirmationDialog";
    import AddProductDialog from "../dialogs/AddProductDialog"
    import AdjustStockDialog from "../dialogs/AdjustStockDialog"
    export default {

        name: 'SingleProduct',
        props: {
            station:Object,
            sStock: Number,
            sender: String,
            prod: Object,
        },
        components: {
            AdjustStockDialog,
            ConfirmationDialog,
            AddProductDialog,
        },
        mounted() {
            this.stationStock = this.sStock;
            if(this.station) {
                this.product = this.prod.product;
            } else {
                this.product = this.prod;
            }
            this.loading = false;
            this.loadImage();
        },
        data() {
            return {
                showAdjustStock: false,
                stationStock: null,
                sending: false,
                image: null,
                imageLoading: true,
                loading: true,
                product: null,
                showModal: false,
                showConfirmationDialog:false,
                selectedProduct:null,
            };
        },
        methods: {
            adjustStock(st) {
                this.stationStock+=st;
            },
            loadImage() {
                ProductService.getImageByProductId(this.product.id)
                    .then(response => {
                        console.log(response);
                        this.image = response.data.image;
                        this.imageLoading = false
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            },
            updateProduct(product, changed) {
                this.product = product;
                if(changed)
                    this.loadImage();
            },
            removeProduct() {
                this.$emit('product-deleted',this.prod);
            },
            updateStock(stock) {
              this.stationStock+=stock;
              this.product.stock-=stock;
            },
            deleteProduct() {
                this.sending = true;
                ProductService.delete(this.product.id)
                    .then(()=>{
                        this.sending = false;
                        this.$emit('product-deleted',this.prod);
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
            }
        }
    }
</script>

<style>
    .card {
        width: 300px;
        height: 300px;
    }
    .long-card {
        height: 370px !important;
    }

</style>