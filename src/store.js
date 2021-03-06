import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
//import createPersistedState from "vuex-persistedstate";


const fb = require('./firebaseConfig.js')


Vue.use(Vuex, router)
   

export const store = new Vuex.Store({
    state: {
        authenticated: false,
        uid: undefined,
        isAdmin: false,
        currentUser: {},

        clients: undefined,
        projects: [],
        dataFetched: false,

        smallLoader: false,
        loadingScreen: false,

        success: false,

        notification: []

    },
    //plugins: [createPersistedState()],
    getters: {
        getUid(state) {
            return state.uid
        },
        getCurrentUser(state) {
            return state.currentUser
        },
        getIsAdminFromCurrentUser(state) {
            return state.currentUser.isAdmin
        },
        getAuthenticated(state) {
            return state.authenticated
        },
        getProjects(state) {
            return state.projects
        },
        getClients(state) {
            return state.clients
        },
        getSuccess(state) {
            return state.success
        },
        getDataFetched(state) {
            return state.dataFetched
        },
        getNotification(state) {
            return state.notification
        },
        getSmallLoader(state) {
            return state.smallLoader
        }

    },

    mutations: {
        SET_AUTHENTICATED(state, boolean) {
            state.authenticated = boolean;
          },
        SET_CURRENT_USER(state, user) {
            state.currentUser = user
        },
        SET_IS_ADMIN(state, boolean) {
            state.isAdmin = boolean
        },
        SET_UID(state, data) {
            state.uid = data
        },
        SET_SMALL_LOADER(state, boolean) {
            state.smallLoader = boolean
        },
        SET_LOADING_SCREEN(state, boolean) {
            state.loadingScreen = boolean
        },
        SET_CLIENTS(state, clientsArray) {
            state.clients = clientsArray
        },
        SET_PROJECTS(state, projectsArray) {
            state.projects = projectsArray
        },
        SET_SUCCESS(state, boolean) {
            state.success = boolean
        },
        SET_DATA_FETCHED(state, boolean) {
            state.dataFetched = boolean
        },
        ADD_NOTIFICATION(state, data) {
            data.id = Math.random();
            state.notification.push(data);
            setTimeout(() => {
               let index = state.notification.indexOf(data);
               state.notification.splice(index, 1)
            }, 3500)
        },
        REMOVE_NOTIFICATION(state, data) {
            let index = state.notification.indexOf(data);
            state.notification.splice(index, 1)
        },


        SET_OBJECT(state, stateKey, ObjectToSet) {
            const originalObj = state[stateKey];
            let newObj = ObjectToSet;

            for(let entry of newObj.entries()) {
                let entryArray = entry.split(',');
                let entryKey = entryArray[0].replace(/["']/g, ""); //getting the key without quation marks
                let entryValue = entryArray[1];

                if(entryValue != originalObj[entryKey]) {
                    originalObj[entryKey] = entryValue
                }
            }
        },
        SET_SINGLE_ENTRY(state, stateKey, value) {
            state[stateKey] = value
        }
    },

    actions: {
        setAuth(context, authBoolean, userObj) {
            context.commit('SET_AUTHENTICATED', authBoolean);
            context.commit('SET_CURRENT_USER', userObj);
            //context.commit('SET_IS_ADMIN', adminBoolean);
            context.commit('SET_LOADING_SCREEN', false);

        },
            fetchUserProfile({ commit, state }) {
                if(state.currentUser != null) {
                fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                    commit('SET_CURRENT_USER', res.data());
                    commit('SET_IS_ADMIN', res.data().isAdmin);
                    if(state.currentUser && state.isAdmin) {
                        commit('SET_AUTHENTICATED', true)
                    }
                }).catch(err => {
                    console.log(err)
                })
            } else {
                commit('SET_CURRENT_USER', {});
                commit('SET_IS_ADMIN', false);
            }
            },


        fetchUser({ commit }, user) {
            //const self = this;
            if (user && user.isAdmin) {
              commit("SET_AUTHENTICATED", user !== null);
              commit("SET_CURRENT_USER", {
                user
              });
              commit("SET_IS_ADMIN", user.isAdmin);
              //router.replace('projects')

            } else {
              commit("SET_CURRENT_USER", null);
              console.log('no permission')
            }
          },

        setIsAdmin(context, boolean) {
            context.commit('SET_IS_ADMIN', boolean)
        },
        setClients (context, clients) {
            context.commit('SET_CLIENTS', clients)
        },
        setProjects (context, projects) {
            context.commit('SET_PROJECTS', projects)
        },
        patchUid(context, data) {
            console.log('action working')
            context.commit('SET_UID', data)
        },
        setCurrentUser(context, data) {
            context.commit('SET_CURRENT_USER', data)
        },
        setLoadingScreen(context, boolean) {
            context.commit('SET_LOADING_SCREEN', boolean);
        },
        setSingleEntry (context, stateKey, data) {
            context.commit('SET_SINGLE_ENTRY', stateKey, data)
        },
        setSuccess (context, boolean) {
            context.commit('SET_SUCCESS', boolean)
        },
        setDataFetched (context, boolean) {
            context.commit('SET_DATA_FETCHED', boolean)
        },
        setAddNotification(context, data) {
            context.commit('ADD_NOTIFICATION', data)
        },
        setRemoveNotification(context, data) {
            context.commit('REMOVE_NOTIFICATION', data)
        },
        setSmallLoader(context, boolean) {
            context.commit('SET_SMALL_LOADER', boolean)
        }
    }, 
})

export default store
