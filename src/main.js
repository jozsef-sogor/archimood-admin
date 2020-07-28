import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store } from './store.js';

const fb = require('./firebaseConfig.js')


//import firebaseConfig from "./assets/mixins/firebaseConfig.js";
//import general from "./assets/mixins/general.js";

import "./assets/css/_global.scss";



Vue.config.productionTip = false;

let app
fb.auth.onAuthStateChanged(user => {
  console.log('user from main.js: ', user);
  store.dispatch('setCurrentUser', user);
  store.dispatch('fetchUserProfile');
  router.replace('/clients');
    if (!app) {
        app = new Vue({
            el: '#app',
            router,
            store,
            render: h => h(App)
        })
    }
})

/*
new Vue({
  //mixins: [firebaseConfig, general],
  store,
  router,
  render: h => h(App)
}).$mount("#app"); */

/*
let app = '';
this.auth.onAuthStateChanged(() => {
  if(!app){
    app = new Vue({
      mixins: [firebaseConfig, general],
      router,
      store,
      render: h => h(App),
    }).$mount('#app')
  }
});
*/