const functions = require("firebase-functions");
const firebase = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

  function isValidUser(localId) {
    firebase.firestore()
    .collection('/users')
    .doc(localId)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        console.log("valid user")
        return "valid user"
      } else {
        console.log("No valid user");
        return "No valid user"
      }
    })
    .catch(function (error) {
      console.log("Error : ", error);
    })
  }

exports.helloWorld = functions.https.onRequest(

    (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  firebase.firestore()
  .collection('/users')
  .doc(request.query.localId)
  .get()
  .then(function (doc) {
    if (doc.exists) {
      console.log("doc.data().login",doc.data().login._seconds)
      // TODO ログイン時間を更新する
      const lastLogin = doc.data().login._seconds

      console.log("updated")
      response.send(`valid user last login ${lastLogin} now login ${now}`)

    } else {
        response.send("No valid user");
    
    }
  })
  .catch(function (error) {
    console.log("Error : ", error);
  })

  const now = new Date();
  firebase.firestore()
  .collection('/users')
  .doc(request.query.localId)
  .update({
    login: now
  })

}
);

