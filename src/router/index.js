import Vue from "vue";
import VueRouter from "vue-router";
import firebase from 'firebase'

import Login from "../views/Login.vue";
import Projects from "../views/Projects.vue";
import SpecificProject from "../views/SpecificProject.vue";
import Clients from "../views/Clients.vue";
import SpecificClient from "../views/SpecificClient.vue";
import Files from "../views/Files.vue";
import Settings from "../views/Settings.vue";
//import fb from "../assets/mixins/firebaseConfig";
import { store } from "../store";

const fbConfig = require('../firebaseConfig.js')

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/login'
 },
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/projects",
    name: "Projects",
    component: Projects,
    meta: {
      requiresAuth: true
   }
  },
  {
    path: "/projects/:projectId",
    name: "SpecificProject",
    component: SpecificProject,
    params: {id: ":projectId"},
      meta: {
        requiresAuth: true
    }
   },
  {
    path: "/clients",
    name: "Clients",
    component: Clients,
    meta: {
      requiresAuth: true
   }
  },
  {
    path: "/clients/:userId",
    name: "SpecificClient",
    component: SpecificClient,
    params: {id: ":userId"},
    meta: {
      requiresAuth: true
   }
   },
  {
    path: "/files",
    name: "Files",
    component: Files,
    meta: {
      requiresAuth: true
   }
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true
   }
  },
   {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  const isAdmin = store.state.isAdmin;
  console.log(store.state.isAdmin);
  if (requiresAuth && !currentUser) {
      next('/login')
  } else if (requiresAuth && currentUser && isAdmin) {
      if(store.state.clients == undefined || store.state.projects == undefined) {
        fbConfig.functions.initialFetch();
        next()
      } else {
        next()
      }
  } else if (to.name === "Login" && currentUser){
    if(store.state.clients == undefined || store.state.projects == undefined) {
      fbConfig.functions.initialFetch();
      next('/projects')
    } else {
      next('/projects')
    }
  } else {
    if(store.state.clients == undefined || store.state.projects == undefined) {
      fbConfig.functions.initialFetch();
      next()
    } else {
      next()
    }
  }
})

export default router;
