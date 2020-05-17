const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createClient = functions.firestore
  .document(`users/{newUserId}`)
  .onCreate(async (snap, context) => {
    const id = context.params.newUserId;
    const email = snap.data().email;
    const phone = snap.data().phone;
    const name = snap.data().name;
    //const phone = snap.data().phone;
    console.log('newUserId: ', id)
    
    const newUser = await admin.auth().createUser({
        uid: id,
        email: email,
        phoneNumber: phone,
        displayName: name,
        password: '123456'
      });


      return newUser;
  
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
