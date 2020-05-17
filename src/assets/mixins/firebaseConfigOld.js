
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'
import store from '../../store'



let config = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_FmessagingSenderId,
    appId: process.env.VUE_APP_appId,
    measurementId: process.env.VUE_APP_measurementId
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export default {
  name: 'firebasefunctions',
  data() {
    return {
      //ownProfileListenerStarted: false,
    }
  },
  computed: {
    db: function() {
      return firebase.firestore();
    },
    storage: function() {
      return firebase.storage();
    },
    auth: function() {
      return firebase.auth();
    }
  },

  methods: {
    
    /*$_auth_check: function() {
        //console.log("$_auth_check " + this.$store.getters.get_authenticated);
        const self = this;
  
        this.auth.onAuthStateChanged(function(currentUser) {
          console.log("auth state changed ");
          console.log(currentUser);
          if (currentUser) {
          
            // User is signed in.
            self.$store.dispatch('set_authenticated', true);
            self.$root.myUID = currentUser.uid;
            console.log("updated own uid: " + self.$root.myUID);
  
            
            self.$root.showLoader = false;
            self.$_fetchData();

          } else {
  
            self.$root.showLoader = false;
            
            // No user is signed in.
            self.$root.authenticated = false;
            self.$store.dispatch('set_authenticated', false);
            self.$root.myUID = null;  
          }
        })
      
    },*/

    $_login(email, password){
      this.auth.signInWithEmailAndPassword(email, password)
         .then(user => {
            console.log(user);
         })
         .catch(err => {
           console.log(err.message);
           return(err)
          //this.$emit('login-error', err.message)
         });
   },

    $_fetchData: function() {
        
    },
    
    $_fetchCollectionWithSnapshot: function (collection) {
      this.db.collection(collection).onSnapshot(function(snapshot) {

          snapshot.docChanges().forEach(function(change) {
              if (change.type === "added") {
                  console.log(`New ${collection}: `, change.doc.data());
              }
              if (change.type === "modified") {
                  console.log(`Modified ${collection}: `, change.doc.data());
              }
              if (change.type === "removed") {
                  console.log(`Removed ${collection}: `, change.doc.data());
              }
          });
      }, function(error){
        console.log(`Error while fetching ${collection}: `, error)
      })
    },

    $_fetchDocumentWithSnapshot: function (collection, document) {
      this.db.collection(collection).doc(document).onSnapshot(function(snapshot) {

          snapshot.docChanges().forEach(function(change) {
              if (change.type === "added") {
                  console.log(`New ${collection, document}: `, change.doc.data());
              }
              if (change.type === "modified") {
                  console.log(`Modified ${collection, document}: `, change.doc.data());
              }
              if (change.type === "removed") {
                  console.log(`Removed ${collection, document}: `, change.doc.data());
              }
          });
      }, function(error){
        console.log(`Error while fetching ${collection, document}: `, error)
      })
    },

    $_fetchUserData: function(uid) {      
      return this.db.collection('users').doc(uid).get()
    },

    $_getDocument: function(collection, document) {
      let ref = this.db.collection(collection).doc(document);
      ref.get()
      .then(function(snapshot) {
        return snapshot
      })
      .catch(function(error) {
        console.log(error)
      })
    },

    $_setDocumentDataWithMerge: function(collection, document, data) {
      let ref = this.db.collection(collection).doc(document);

      ref.set({data}, { merge: true });
    },

    $_updateDocumentData: function (collection, document, updates) {
      let ref = this.db.collection(collection).doc(document);

      ref.update(updates)
      .then(function() {
        console.log(`${document} successfully updated!`);
      })
      .catch(function(error) {
          // The document probably doesn't exist.
          console.error(`Error updating ${document}: `, error);
      });
    }

  } 
}
