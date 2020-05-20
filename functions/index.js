const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs=require('fs'); 
const nodemailer = require('nodemailer');
admin.initializeApp();


const gmailEmail = "archimood.exam.project@gmail.com";
const gmailPassword = "Archimood123";
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


var htmlmail=fs.readFileSync("welcome-mail.html","utf-8").toString();

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const recipent_email = user.email; 
   
    const mailOptions = {
        from: '"Archimood Design" <archimood.exam.project@gmail.com>',
        to: recipent_email,
        subject: 'Welcome to Archimood Design',
         html: htmlmail
    };
    
  try {
    mailTransport.sendMail(mailOptions);
    console.log('mail send');
    
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
return null; 
  });





exports.newClient = functions.https.onCall( async (data, context) => {
        //const id = context.params.newUserId;
        const email = data.email;
        const phone = data.phone;
        const name = data.name;
        const time = Date.now()



        return admin.auth().createUser({
            email: email,
            password: "123456",
            displayName: name,
            //phoneNumber: phone
        })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            var userObject = {
                name : userRecord.displayName,
                email : userRecord.email,
                phone: phone,
                isAdmin: false,
                created: time
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
