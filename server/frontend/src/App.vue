<template>
  <div>
    <input v-on:keyup.up="control('up')" type="text">
    <img v-bind:src="this.data.socket.camera"> 
  </div>
</template>
  

<script>
import axios from "axios"



export default {
    name: 'App',
    props: {
        msg: String
    },
    data() {
      return {
        socket:{
          camera: ''
        }
      }
    },
    sockets: {
      MessageChannel(data) {
        this.socket.camera = data
      }
    },
    methods:{
      async control(content){

        let res = await axios.post("http://localhost:3000/api/control", {"content": content})
        console.log(res)
      },
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
}
div {
  width: 100%;
  height:100vh;
}
</style>
