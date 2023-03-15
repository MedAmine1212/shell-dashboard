<template>
    <div style="width: 100%">
        <div style="margin-top:70px;margin-bottom: -80px;display: flex;width: 100%;justify-content: center !important;">
        <img src="../assets/images/Shell-Logo.png" width="300"/>
        </div>
    <div class="loginContainer"><!-- Email input -->
        <div style="width: 400px;margin-top: 70px">
        <div  class="form-outline mb-4">
            <label style="float: left" class="form-label">Email address</label>
            <input style="border: 1px solid darkgrey;border-radius: 5px" type="email" id="emailInput"  class="form-control" />
        </div>

        <!-- Password input -->
        <div class="form-outline mb-4">
            <label style="float: left"  class="form-label" for="passwordInput">Password</label>
            <input style="border: 1px solid darkgrey;border-radius: 5px" type="password" id="passwordInput" class="form-control" />
        </div>

        <!-- Submit button -->
        <button @click="authenticate()" type="button" class="btn btn-warning btn-block mb-4">Sign in</button>

            <div class="row mb-4">
                <div style="width: 100%">
                    <a style="float: right; color:#FF141E" href="#!">Forgot password?</a>
                </div>
            </div>
        <!-- Register buttons -->

            <div class="spinner-container" v-if="sending" >
                <div class="spinner-grow text-warning spinner" role="status"><span class="sr-only">Loading...</span></div>
            </div>
    </div>
    </div>
    </div>

</template>

<script>
    import Swal from 'sweetalert2'
    import auth from './../services/auth.js'
    import router from "@/router";
    export default {
        name: 'LoginPage',
        components: {
        },
        data() {
            return {
                sending: false,
                isAdmin: false,
                padClicked: false,
                emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            };
        },
        methods: {
            async authenticate(){
                if(this.sending)
                    return ;
                let password = document.getElementById("passwordInput").value;
                let email = document.getElementById("emailInput").value;
                if(!this.emailRegex.test(email)) {
                    Swal.fire({
                        position: 'top-end',
                        background: "rgb(252, 226,74)",
                        icon: "error",
                        iconColor: "red",
                        color: "red",
                        text: 'Invalid email !',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return
                }
                if(!password.length) {
                    Swal.fire({
                        position: 'top-end',
                        background: "rgb(252, 226,74)",
                        icon: "error",
                        iconColor: "red",
                        color: "red",
                        text: 'password required !',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    return;
                }

                this.sending = true;
                await auth.actions.authenticate(email, password)
                    .then( async (res) => {
                        await auth.actions.setToken(res.data.access_token);
                        await auth.actions.setUserType(res.data.user_type);
                        router.push({name: "dashboard"});
                    })
                    .catch(error => {
                            Swal.fire({
                                position: 'top-end',
                                background: "rgb(252, 226,74)",
                                icon: "error",
                                iconColor: "red",
                                color: "red",
                                text: 'Invalid login credentials !',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            this.sending = false;
                        console.log(error);
                    });
            }
        },
    }
</script>
<style>
    .divider:after,
    .divider:before {
        content: "";
        flex: 1;
        height: 1px;
        background: #eee;
    }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
