<template>
    <div>
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else class="header-container">
            <button type="button" @click="showModal = true" style="float: right;margin-right: 60px" title="Add product" class="btn btn-warning"><i class="fas fa-plus"></i></button>
            <div style="display: flex">
                <h2 style="margin-left: 10px"><b>Products</b></h2>
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
            <div v-if="products.length" class="products">
                <single-product @product-deleted="deleteProduct" v-for="product in productsList" :key="product.id" :prod="product"></single-product>
            </div>
            <div style="margin-top: 300px" v-else class="text-gray-600 text-center py-16">
                No products to show
            </div>
        </div>
        <add-product-dialog v-if="showModal"  :modalTitle="'Add product'"
                            :show.sync="showModal"
                            @product-emitted="addProduct"
                            :product="null"
                            @close="showModal=false"
                            ref="AddUserDialog" ></add-product-dialog>
    </div>
</template>

<script>

    import AddProductDialog from "../dialogs/AddProductDialog"
    import SingleProduct from "./SingleProduct"
    import ProductService from "../../services/ProductService";
    import Swal from 'sweetalert2'
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Products',
        components: {
             SingleProduct,
            AddProductDialog,
        },
        data() {
            return {
                searchValue: "",
                showModal:false,
                loading: true,
                products: [],
            };
        },
        computed: {
            productsList() {
                return this.products.filter((product) => product.label.toLowerCase().includes(this.searchValue.trim().toLowerCase()));
            }
            },
        methods: {
            addProduct(product ,type) {
                if(type === "add")
                    this.products.push(product);
                else {
                    for(let i =0;i<this.products.length;i++) {
                        if(this.products[i].id === product.id){
                            this.products[i].stock=product.stock;
                            break;
                        }
                    }
                }
            },
            deleteProduct(product) {
                this.products.splice(this.products.indexOf(product),1);
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text:"Product deleted successfully",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        },
        async created() {
            ProductService.findAll()
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

