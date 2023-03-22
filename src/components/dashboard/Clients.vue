<template>
    <div>
        <button v-if="!loading" type="button" @click="showModal = true, modalTitle='Add client'" style="float: right;margin-right: 40px" title="Add station admin" class="btn btn-warning"><i class="fas fa-plus"></i></button>

        <div v-if="!loading" class="clients-header">
        <h1>Clients</h1>
            <div style="margin-top: 3px" class="flip-container">
                <div @click="showAll = true, toShow = allClients" :class="{ 'flip-active': showAll }" class="flip">All</div>
                <div @click="showAll = false, toShow = unverifiedClients" :class="{ 'flip-active': !showAll }" class="flip">Unvalidated</div>
            </div>
        </div>
        <hr v-if="!loading">
        <div class="spinner-container" v-if="loading" >
            <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>
        <div v-else>
            <UserCards @user-emitted="updateUser" v-if="toShow.length"  :users="toShow" :type="'client'"></UserCards>
            <div style="margin-top: 200px" v-else class="text-gray-600 text-center py-16">
                No clients to show
            </div>
        </div>
        <add-user-dialog v-if="showModal"  :modalTitle="modalTitle"
                         :show.sync="showModal"
                         @user-emitted="addUser"
                         :user="null"
                         :type="'client'"
                         @close="showModal=false"
                         ref="AddUserDialog" ></add-user-dialog>
    </div>
</template>

<script>
    import UserCards from "./UserCards";
    import AddUserDialog from "../dialogs/AddUserDialog";
    import ClientService from "../../services/ClientService";
    export default {
        // eslint-disable-next-line vue/multi-word-component-names
       name: 'Clients',
        components: {
            AddUserDialog,
            UserCards,
        },
        data() {
            return {
                text: "",
                id: null,
                showModal: false,
                loading: true,
                showAll: true,
                toShow: [],
                allClients: [],
                unverifiedClients: [],
            };
        },
        methods: {
            addUser(user) {
                this.unverifiedClients.push(user);
                this.allClients.push(user);
            },
            updateUser(user) {
                for (let i=0;i<this.allClients.length;i++){
                    if(this.allClients[i].id === user.id) {
                        this.unverifiedClients.splice(this.unverifiedClients.indexOf(user), 1);
                        this.allClients[i].validated = true;
                        if(this.showAll)
                            this.toShow = this.allClients;
                        else
                            this.toShow = this.unverifiedClients;
                        break;
                    }
                }
            }
        },
        async created() {
            await ClientService.findAll()
                .then(async (res)=>{
                    console.log(res);
                    this.allClients = res.data.clients;
                    this.toShow = this.allClients;
                   for (let i=0;i<res.data.clients.length;i++){
                       if(!res.data.clients[i].validated) {
                           this.unverifiedClients.push(res.data.clients[i]);
                       }
                   }
                   this.loading = false;
                })
                .catch((error)=>{
                    this.loading = false;
                    console.log(error);
                    this.loading = false;
                })
        }
   }
</script>

