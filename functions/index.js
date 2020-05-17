const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.newClient = functions.https.onCall( async (data, context) => {
        //const id = context.params.newUserId;
        const email = data.email;
        const phone = data.phone;
        const name = data.name;

        return admin.auth().createUser({
            email: email,
            password: "123456",
            displayName: name,
            phoneNumber: phone
        })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            var userObject = {
                name : userRecord.displayName,
                email : userRecord.email,
                phone: userRecord.phoneNumber,
                isAdmin: false
             };
             console.log("Successfully created new user:", userRecord.uid);

             return admin.firestore().doc('users/'+userRecord.uid).set(userObject);
        })
        .catch(function(error) {
            console.log("Error creating new user:", error);
        });
        
  });
/*
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
*/
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
