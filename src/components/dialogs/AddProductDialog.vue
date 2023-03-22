<template>

    <div v-if="show" class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box">
            <div class="dialog-header">
                <h5 class="dialog-title">{{modalTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Label</label>
                    <input v-if="thisProduct" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisProduct.label" type="text" class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Description</label>
                    <input v-if="thisProduct" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisProduct.description" type="text" class="form-control" />
                </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Price (DT)</label>
                    <input v-if="thisProduct" style="border: 1px solid darkgrey;border-radius: 5px" v-model="thisProduct.price" type="text" class="form-control" />
               </div>
                <div  class="form-outline mb-4">
                    <label style="float: left" class="form-label">Stock</label>
                    <input v-if="thisProduct" style="border: 1px solid darkgrey;border-radius: 5px" min="1" v-model="thisProduct.stock" type="number" class="form-control" />
                </div>
                <div v-if="thisProduct" class="mb-4">
                    <div style="display: flex;margin-bottom: 5px"><label>Image</label> <div v-if="thisProduct.id" style="margin-top: 6px;background-color: #FF141E" title="Select an image if you want to change the old one" class="question-info"><i class="fas fa-exclamation"></i></div></div>

                    <input @change="onFileSelected" type="file" accept="image/png, image/gif, image/jpeg" id="productImage" class="form-control">
                </div>
            </div>
            <div class="dialog-footer">
                <button v-if="product" type="button" @click="editProduct()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Save</span>
                    <div v-else class="spinner-grow text-bg-light" style="height: 20px;width: 20px" role="status"><span class="sr-only">Sending...</span></div>
                </button>
                <button v-else type="button" @click="addProduct()" class="btn btn-info dialog-button" >
                    <span v-if="!sending">Add</span>
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
    import ProductService from "../../services/ProductService";
    export default {
        name: 'AddProductDialog',
        props: {
            product: Object,
            modalTitle: String,
            show: Boolean,
        },
        mounted() {
            if(this.product)
                this.thisProduct = this.product;
            else {
                this.thisProduct = {};
                this.thisProduct.label = "";
                this.thisProduct.description = "";
                this.thisProduct.price = "";
                this.thisProduct.stock = "";
            }
        },
        data() {
            return {
                image: null,
                sending : false,
                thisProduct: null,
            };
        },
        methods: {
            onFileSelected(event) {
                this.image = event.target.files[0];
            },
            close() {
                this.$emit('close');
            },
            checkInputs(label, description, price, stock) {
                if(label.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Label required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(description.length === 0) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Description required',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(price.length === 0 || isNaN(price)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid price',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                if(stock.length === 0 || isNaN(stock)) {
                    Swal.fire({
                        position: 'bottom-right',
                        background: "rgba(228,161,27,0.8)",
                        color: "white",
                        text: 'Invalid stock',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1000
                    });
                    return false;
                }
                return true;
            },
            async addProduct() {
                if (this.sending)
                    return;
                if(this.checkInputs(this.thisProduct.label, this.thisProduct.description, this.thisProduct.price, this.thisProduct.stock)) {
                    if(!this.image) {
                        Swal.fire({
                            position: 'bottom-right',
                            background: "rgba(228,161,27,0.8)",
                            color: "white",
                            text: 'Product image required',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1000
                        });
                        return
                    }
                    this.sending = true;
                    const formData = new FormData();
                    formData.append("image", this.image);
                    formData.append("label", this.thisProduct.label);
                    formData.append("description", this.thisProduct.description);
                    formData.append("price", this.thisProduct.price);
                    formData.append("stock", this.thisProduct.stock);
                    ProductService.addProduct(formData)
                        .then(async (res)=>{
                            if(res.data.type === "update") {
                                this.refreshProducts(res.data.product, 'Product already exists: Product stock updated', 'stock');
                            }
                             else {
                                this.refreshProducts(res.data.product, 'Product added successfully', 'add');
                            }
                        })
                        .catch((err)=>{
                            this.sending = false;
                            console.log(err);
                        })
                }
            },
            async editProduct() {
                if (this.sending)
                    return;
                if(this.checkInputs(this.thisProduct.label, this.thisProduct.description, this.thisProduct.price, this.thisProduct.stock)) {
                    this.sending = true;
                    const formData = new FormData();
                    if(this.image != null) {
                        formData.append("image", this.image);
                    }
                    formData.append("label", this.thisProduct.label);
                    formData.append("description", this.thisProduct.description);
                    formData.append("price", this.thisProduct.price);
                    formData.append("stock", this.thisProduct.stock);
                    ProductService.update(this.product.id, formData)
                        .then(()=>{
                            const changed = this.image != null;
                            this.$emit('update-emitted',this.thisProduct, changed);
                            this.sending = false;
                            this.close();
                        })
                        .catch((err)=>{
                            this.sending = false;
                            console.log(err);
                            Swal.fire({
                                position: 'bottom-right',
                                background: "rgba(228,161,27,0.8)",
                                color: "white",
                                text: 'Product label already in use',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1000
                            });
                        })
                }
            },
            async refreshProducts(product, title, type) {
                this.$emit('product-emitted',product, type);
                this.sending = false;
                this.close();
                Swal.fire({
                    position: 'bottom-right',
                    background: "rgba(19,150,71,0.8)",
                    color: "white",
                    text:title,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    timer: 1000
                });
            }
        }
    }
</script>