import { createApp } from 'vue'
import App from './App.vue'
import socketio from 'socket.io'
import VueSocketIO from 'vue-socket.io'
export const SocketInstance = socketio('http://127.0.0.1:3000');

Vue.use(VueSocketIO, SocketInstance)


createApp(App).mount('#app')
