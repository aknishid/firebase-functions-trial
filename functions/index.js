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
      const idToken = request.query.idToken;
      let uid;
      functions.logger.info("idToken", idToken);
      firebase.auth()
          .verifyIdToken(idToken)
          .then((decodedToken) => {
            uid = decodedToken.uid;
            functions.logger.info(`uid: ${uid}`);
            // ログイン時間の更新
            const now = new Date();
            firebase.firestore()
                .collection("/users")
                .doc(uid)
                .update({
                  login: now,
                });
            firebase.firestore()
                .collection("/users")
                .doc(uid)
                .get()
                .then(function(doc) {
                  if (doc.exists) {
                    const lastLogin = doc.data().login._seconds;
                    const name = doc.data().name;
                    response
                        .status(200)
                        .send({"name": name, "lastLogin": lastLogin});
                  } else {
                    response.send("No valid user");
                  }
                })
                .catch(function(error) {
                  response.send(`${error}`);
                });
          })
          .catch((error) => {
            response.send(`${error}`);
          // Handle error
          });
    }
);

