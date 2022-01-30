<template>
  <div>
    <img v-bind:src="this.data.camera"/>
    <button @click="controls('up')">UP</button>
  </div>
</template>

<script>
//import SocketioService from './services/socketio.service.js';
import io from 'socket.io-client'
import axios from 'axios'

export default {
  name: 'App',
  components: {},
  data() {
    return{
      data: {},
      socket : io('188.63.53.11:3000'), //188.63.53.11:3000
      api : "http://188.63.53.11:3000" //188.63.53.11
    }
  },
  methods: {
    async controls(order){
      await axios.post(this.api + '/command',  {order : order})
    },
  },
  mounted() {
    this.controls('up')
    //this.socket.connect()
    //this.socket.connect('188.63.53.11')
    /*
    this.socket.on('test', (foo)=> {
      console.log(foo);
    })
    */
    this.socket.on('data', (data)=> {
      this.data = data
      this.data.camera = "data:image/jpg;base64, " + this.data.camera
      console.log(this.data.camera)
      console.log(this.data.telemetry.TEMPERATURE)
    })
  }
}
</script>

<style>


</style>
