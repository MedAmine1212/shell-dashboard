<template class="welcome">
  <div @click="gotToLogin" class="welcomeContainer">
    <img src="./../assets/images/shell.jpg"/>
  </div>
</template>
<script>

  import router from "@/router";

export default {
  name: 'WelcomePage',
  methods: {
async gotToLogin(){
  router.push({name: "login"});
}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
