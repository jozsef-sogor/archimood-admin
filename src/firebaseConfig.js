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
            store.dispatch('setClientSuccess', true)
            }
        })
        .catch(function(error) {
          // Getting the Error details.
          //var code = error.code;
          var message = error.message;
          var details = error.details;
          console.log(message , details)
          // ...
        }); 
        //console.log(creatingClient);
         //this.setDocumentDataWithAutoId('users', creatingClient)
     },
     setDocumentDataWithMerge: function(collection, document, data) {
        let ref = db.collection(collection).doc(document);
  
        ref.set({data}, { merge: true })
        .then(function() {
            console.log(`${document} successfully written!`);
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      },
      setDocumentDataWithAutoId: function(collection, data) {
        let ref = db.collection(collection);
  
        ref.add(data)
        .then(function() {
            console.log(`${collection} successfully written!`);
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      },
      initialFetch: function() {
        this.fetchAllUsers();
        this.fetchAllProjects();

      },
      fetchAllUsers: function() {
        usersCollection
            .onSnapshot(function(querySnapshot) {
                console.log(querySnapshot.docs);
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
                    } else {
                        console.log("that's admin")
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
                    projects.push(snapshot.data())
                })
                store.dispatch('setProjects', projects);
                projects = [];
            },
            
            function(error) {
                console.log('error while loading initial data: ', error)
            });
      }

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