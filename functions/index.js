const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs=require('fs'); 
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
admin.initializeApp();

const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);


exports.newClientEmail = functions.auth.user().onCreate((user) => {
  const recipent_email = user.email;
  const recipient_name = user.displayName;

  const msg = {
    to: recipent_email,
    from: 'sogor.jozsef98@gmail.com',

    templateId: 'd-e186d38c27874f88b67c072e63ab2465',
    dynamicTemplateData: {
      name: recipient_name
    }
  };

  return sgMail.send(msg)

.then(()=> console.log('email sent'))
.catch(error => console.log(error.response.body))
})


/*
const gmailEmail = "sogor.jozsef@hotmail.com";
const gmailPassword = "QAWSedrftgzh12";
const mailTransport = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


//var htmlmail=fs.readFileSync('test.html',"utf-8").toString();

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
    const recipent_email = user.email; 
   
    const mailOptions = {
        from: '"Archimood Design" <sogor.jozsef98@gmail.com>',
        to: recipent_email,
        subject: 'Welcome to Archimood Design',
         html: //htmlmail
         `<h1>Dear ${user.displayName}</h1>
         <h3>Welcome at Archimood Design</h3>
         <p>A client profile was created for you</p>
     
         <h2>To sign in use your email address and password</h2>
         <p>Your password is: 123456</p>
     
         <a href="https://www.jozsef-sogor.com/exam/client"><button>Open site</button></a>
         <a href="https://www.jozsef-sogor.com/exam/client">https://www.jozsef-sogor.com/exam/client</a>
     `
    };
    
  try {
    mailTransport.sendMail(mailOptions);
    console.log('mail send');
    
  } catch(error) {
    console.error('There was an error while sending the email:', error);
  }
return null; 
  });

*/



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

exports.projectNotification = functions.firestore.document(`projects/{projectId}`).onWrite((change, context) => {
  const userId = change.after.data().projectClient;
  const projectName = change.after.data().projectName;
  let token = null;
  
  return admin.firestore().doc(`users/${userId}`).get()
  .then(snapshot => token = snapshot.data().data.notificationToken)
  .then(() => {

    const payload = {
      notification: {
        title: `Update regarding ${projectName}`,
        body: 'Open your profile for more details',
        icon: 'https://placeimg.com/250/250/arch'
      }
    };

   return admin.messaging().sendToDevice(token, payload);
    //console.log('Notification success');
  }).catch(error => {
    console.log(error)
  });

});