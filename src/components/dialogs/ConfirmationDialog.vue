<template>
    <div  class="dialog-container" :class="{ 'd-none': !show }">
        <div class="dialog-box" style="max-width: 350px">
            <div class="dialog-header">
                <h5 class="dialog-title">Delete {{confirmationDialogTitle}}</h5>
                <button type="button" class="dialog-close" @click="close()">
                    &times;
                </button>
            </div>
            <div class="dialog-body">
                Are you sure you want to proceed ?
            </div>
            <div class="dialog-footer">
                <button type="button" class="btn btn-danger dialog-button" @click="confirm()">
                    Yes
                </button>
                <button type="button" class="btn btn-info dialog-button" @click="close()">
                    No
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmationDialog',
        props: {
            show: Boolean,
            confirmationDialogTitle: String,
        },
        methods: {
            close() {
                this.$emit('close');
            },
            confirm() {
                this.$emit('confirm');
                this.close();
            },
        }
    }
</script>