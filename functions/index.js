const functions = require("firebase-functions");
const firebase = require("firebase-admin");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const firebaseConfig = {
  apiKey: functions.config().apikey,
  authDomain: functions.config().authdomain,
  databaseURL: functions.config().databaseurl,
  projectId: functions.config().projectid,
  storageBucket: functions.config().storagebucket,
  messagingSenderId: functions.config().messagingsenderid,
  appId: functions.config().appid,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

exports.helloWorld = functions.https.onRequest(

    (request, response) => {
      functions.logger.info("Hello logs!", {structuredData: true});
      firebase.firestore()
          .collection("/users")
          .doc(request.query.userId)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              const lastLogin = doc.data().login._seconds;
              response.send(`last login ${lastLogin} now login ${now}`);
            } else {
              response.send("No valid user");
            }
          })
          .catch(function(error) {
            console.log("Error : ", error);
          });

      // ログイン時間の更新
      const now = new Date();
      firebase.firestore()
          .collection("/users")
          .doc(request.query.userId)
          .update({
            login: now,
          });
    }
);

