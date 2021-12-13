<template>
  <div v-on:up.right="test()" id="all">
    <input type="text" v-on:keydown.right="test()">
  </div>
</template>

<script>
import axios from "axios"
export default {
    name: 'app',
    props: {
        msg: String
    },
    data() {
    },
    methods:{
      async test(){
          await axios.post("http://localhost:3000/move1")
      }
    },
    computed: {
      
    },
    mounted() {
      
    },
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  width: 100%;
  height: 100vh;
}
#all {
  width: 100%;
  height: 100vh;
  background-color: blueviolet;
}
</style>
