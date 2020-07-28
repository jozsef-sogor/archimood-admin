import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'
import 'firebase/functions'
import store from './store'

// firebase init goes here
const config = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_FmessagingSenderId,
    appId: process.env.VUE_APP_appId,
    measurementId: process.env.VUE_APP_measurementId
};
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const currentUser = auth.currentUser

// date issue fix according to firebase
/*const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)
*/
// firebase collections
const usersCollection = db.collection('users')
const projectsCollection = db.collection('projects')

const functions = {
     testFunction: function() {
         console.log('fb function working')
     },
     registerUser: function (creatingClient) {
        const register = firebase.functions().httpsCallable('newClient');
        register(creatingClient).then(function(result) {
          // Read result of the Cloud Function.
          console.log(result)
          if(result.data != null) {
              let success = {
                  type: 'success',
                  data: 'Client registered succesfully'
              }
            store.dispatch('setSuccess', true)
            store.dispatch('setAddNotification', success)
            store.dispatch('setSmallLoader', false)
            }
        })
        .catch(function(error) {
          // Getting the Error details.
          //var code = error.code;
          var message = error.message;
          var details = error.details;
          let fail = {
              type: 'error',
              data: error.message
          };
          store.dispatch('setAddNotification', fail);
          store.dispatch('setSmallLoader', false);

          console.log(message , details);
          // ...
        }); 
        //console.log(creatingClient);
         //this.setDocumentDataWithAutoId('users', creatingClient)
     },
     logOut: function() {
        auth.signOut()
        .then(function() {
          location.replace('/')
        })
        .catch(function(error) {
          window.alert('Logout failed. Please refresh the page and try again.');
          console.log('Logout error: ', error)
        });
     },

     setDocumentDataWithMerge: function(collection, document, data) {
        let ref = db.collection(collection).doc(document);
  
        ref.set({data}, { merge: true })
        .then(function() {
            let success = {
                type: 'success',
                data: 'Project updated succesfully'
            };
            store.dispatch('setAddNotification', success);
            store.dispatch('setSmallLoader', false);
            store.dispatch('setSuccess', true);


            console.log(`${document} successfully written!`);
        })
        .catch(function(error) {
            let fail = {
                type: 'error',
                data: error.message
            }
            store.dispatch('setAddNotification', fail);
            store.dispatch('setSmallLoader', false);

            console.error("Error writing document: ", error);
        });
      },

      setDocumentData: function(collection, document, data) {
        let ref = db.collection(collection).doc(document);
  
        ref.set(data)
        .then(function() {
            let success = {
                type: 'success',
                data: `New document in ${collection} created succesfully`
            }
            store.dispatch('setAddNotification', success);
            store.dispatch('setSmallLoader', false);
            store.dispatch('setSuccess', true);


            console.log(`${document} successfully written!`);
        })
        .catch(function(error) {
            let fail = {
                type: 'error',
                data: error.message
            }
            store.dispatch('setAddNotification', fail);
            store.dispatch('setSmallLoader', false);


            console.error("Error writing document: ", error);
        });
      },

      setDocumentDataWithAutoId: function(collection, data) {
        let ref = db.collection(collection);
  
        ref.add(data)
        .then(function() {
            let success = {
                type: 'success',
                data: `New document in ${collection} created succesfully`
            }
            store.dispatch('setAddNotification', success);
            store.dispatch('setSmallLoader', false);
            store.dispatch('setSuccess', true);



            console.log(`${collection} successfully written!`);
        })
        .catch(function(error) {
            let fail = {
                type: 'error',
                data: error.message
            }
            store.dispatch('setAddNotification', fail);
            store.dispatch('setSmallLoader', false);


            console.error("Error writing document: ", error);
        });
      },
      
      updateDocument: function(collection, doc, data) {
        let ref = db.collection(collection).doc(doc);
        ref.update(data)
        .then(function() {
            console.log(`${collection} --> ${doc} succesfully updated`);
            return 'success'
        })
        .catch(function(error) {
            console.error(`Error updateing document ${collection} --> ${doc} ${error}`);
            return error
        })
    },

      initialFetch: function() {
        if(store.getters.getAuthenticated == true) {
        this.fetchAllUsers();
        this.fetchAllProjects();
        store.dispatch('setDataFetched', true);
        } else {
            console.log('not logged in')
        }
      },

      fetchAllUsers: function() {
        usersCollection.orderBy("created", "desc")
            .onSnapshot(function(querySnapshot) {
                console.log(querySnapshot.docs);
                let currentUser = store.getters.getCurrentUser;
                let clients = [];
                console.log(clients);
                querySnapshot.docs.forEach(snapshot => {
                    let userObject = {};
                    let isAdmin = snapshot.data().isAdmin;
                    if(isAdmin == false || isAdmin == undefined) {
                        Object.assign(userObject, snapshot.data());
                        userObject.id = snapshot.id;
                        //console.log(snapshot.data());
                        clients.push(userObject);
                    } else if(isAdmin == true && snapshot.id == currentUser.id) {
                        let adminUser =snapshot.data();
                        adminUser.id = snapshot.id
                        store.dispatch('setCurrentUser', adminUser);
                        console.log("that's admin");
                    }
                })
                store.dispatch('setClients', clients);
                clients = [];
                console.log(clients);
            },
            
            function(error) {
                console.log('error while loading initial data: ', error)
            });
      },
      fetchAllProjects: function() {
        projectsCollection
            .onSnapshot(function(querySnapshot) {
                let projects = [];
                querySnapshot.docs.forEach(snapshot => {
                    let projectSnap = snapshot.data();
                    projectSnap.projectId = snapshot.id;
                    projects.push(projectSnap);
                })
                store.dispatch('setProjects', projects);
                projects = [];
            },
            
            function(error) {
                console.log('error while loading initial data: ', error)
            });
      },
      
      deleteDocument: function(collection, doc) {
          let ref = db.collection(collection).doc(doc)

          ref.delete().then(() => {
              let success = {
                  type: 'success',
                  data: 'Document succesfully deleted'
              }
              store.dispatch('setAddNotification', success);
              store.dispatch('setSmallLoader', false);
              store.dispatch('setSuccess', true);

            console.log("Deletion was succesful")
          })
          .catch((error) => {
              let fail = {
                  type: 'error',
                  data: error.message
              }
              store.dispatch('setAddNotification', fail);
              store.dispatch('setSmallLoader', false);


              console.log("error during deletion: ", error)
          })
      },
}



export {
    db,
    auth,
    storage,
    functions,
    currentUser,
    usersCollection,
    projectsCollection,
}