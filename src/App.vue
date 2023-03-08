<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
}
</script>


<style>
  @import './assets/main.css';
#app {

  font-family: 'Inter', serif;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently                         supported by Chrome and Opera */
}
  @font-face {
    font-family: "Inter";
    src: local("Inter"),
    url(./fonts/Inter-VariableFont_slnt,wght.ttf) format("truetype");
  }
</style>
