<template>
    <div class="loginContainer">
        <img src="../assets/images/Shell-Logo.png" width="347" height="195"><br><br>
        <div style="height:202px" v-if="!padClicked"></div>
        <img src="../assets/images/barCode.png" width="255" style="margin-top: 20px" height="212"><br>
        <h1 class="scan-text">SCAN YOUR CLIENT CARD</h1>
        <H1 class="scan-text-2">PLEASE SCAN THE BAR CODE OF YOUR SHELL CARD</H1><br>
        <input @click="padClicked = true" value="" id="loginInput" type="text" class="loginInput" placeholder="CLICK HERE TO TYPE IN YOU CARD CODE"/><br><br>
        <div v-if="padClicked" class="pad-container">
            <div class="pad">
                <div class="pad-elements">
                    <div @click="clickPad(1)" class="pad-element">1</div>
                    <div @click="clickPad(2)" class="pad-element">2</div>
                    <div @click="clickPad(3)" class="pad-element">3</div>
                    <div @click="clickPad(4)" class="pad-element">4</div>
                    <div @click="clickPad(5)" class="pad-element">5</div>
                    <div @click="clickPad(6)" class="pad-element">6</div>
                    <div @click="clickPad(7)" class="pad-element">7</div>
                    <div @click="clickPad(8)" class="pad-element">8</div>
                    <div @click="clickPad(9)" class="pad-element">9</div>
                    <div @click="clickPad(-2)" class="pad-element red">X</div>
                    <div @click="clickPad(0)" class="pad-element">0</div>
                    <div @click="clickPad(-1)" class="pad-element red">&lt;</div>
                </div>
                <div style="display: flex;justify-content: center;width: 100%  ">
                    <div @click="clickPad(10)" class="confirm red">CONFIRM</div>
                </div>
            </div>
        </div>
        <div class="spinner-container" v-if="sending" >
            <div class="spinner-grow text-danger spinner" role="status"><span class="sr-only">Loading...</span></div>
        </div>

        <div v-if="isAdmin" style="display: flex; flex-direction: row;width:100%;justify-content: center;margin-top:100px">
            <div>
                <h1>Type in you password</h1><br>
                <v-otp-input
                        ref="otpInput"
                        input-classes="otp-input"
                        separator="-"
                        :num-inputs="4"
                        :should-auto-focus="true"
                        :is-input-num="true"
                        :conditionalClass="['one', 'two', 'three', 'four']"
                        :placeholder="['*', '*', '*', '*']"
                        @on-change="handleOnChange"
                        @on-complete="handleOnComplete"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2'
    import auth from './../services/auth.js'
    import VOtpInput from 'vue3-otp-input';
    import {ref} from "vue";
    import router from "@/router";
    export default {
        name: 'LoginPage',
        components: {
            VOtpInput,
        },
        data() {
            return {
                sending: false,
                padValue: null,
                isAdmin: false,
                padClicked: false
            };
        },
        methods: {
            async clickPad(num) {
                this.padValue = document.getElementById("loginInput").value;
                if (num === -1) {
                    if (this.padValue.length > 0)
                        document.getElementById("loginInput").value = this.padValue.slice(0, this.padValue.length - 1);
                } else if (num === 10) {
                    if (isNaN(this.padValue) || this.padValue.length === 0) {
                        await Swal.fire({
                            position: 'top-end',
                            background: "rgb(252, 226,74)",
                            icon: "error",
                            iconColor: "red",
                            color: "red",
                            text: 'Invalid code !',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    } else {
                        if (!this.sending) {
                            this.sending = true;
                            await auth.actions.getUser(this.padValue)
                                .then( async (res) => {
                                    document.getElementById("loginInput").value = "";
                                    auth.actions.setUserType(res.data.userType);
                                    auth.actions.setBarCode(this.padValue);
                                    if(res.data.userType === "client" || res.data.userType === "employee") {
                                        await auth.actions.authenticate(this.padValue, null) .then( async (res) => {
                                           await auth.actions.setToken(res.data.access_token);
                                            router.push({name: "home"});
                                        })
                                            .catch(error => {console.log(error)});
                                    } else {
                                        this.isAdmin = true;
                                    }
                                    this.sending = false;
                                })
                                .catch(error => {
                                    console.log(error);
                                    this.sending = false;
                                    if (error.response.status === 404) {
                                        Swal.fire({
                                            position: 'top-end',
                                            background: "rgb(252, 226,74)",
                                            icon: "error",
                                            iconColor: "red",
                                            color: "red",
                                            text: 'User not found !',
                                            timerProgressBar: true,
                                            showConfirmButton: false,
                                            timer: 1500
                                        });
                                    }
                                })
                        }
                    }
                } else if (num === -2) {
                    document.getElementById("loginInput").value = "";
                } else
                    document.getElementById("loginInput").value += num;
            }
        },
        setup() {
            const otpInput = ref(null);
            const handleOnComplete = async (value) => {
                await auth.actions.authenticate(auth.actions.getBarCode(), value)
                    .then( async (res) => {
                        await auth.actions.setToken(res.data.access_token);
                        router.push({name: "dashboard"});
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            Swal.fire({
                                position: 'top-end',
                                background: "rgb(252, 226,74)",
                                icon: "error",
                                iconColor: "red",
                                color: "red",
                                text: 'Invalid password !',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            clearInput();
                        }
                        console.log(error);
                    });
            };
            const clearInput = () => {
                otpInput.value.clearInput()
            }
            return { handleOnComplete, clearInput, otpInput };
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
