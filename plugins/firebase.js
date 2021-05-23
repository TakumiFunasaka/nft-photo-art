import firebase from "firebase";

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBjUgZHNKdaAlcoSXZn31p75i_csAAUIkU",
    authDomain: "wedding-f0fc3.firebaseapp.com",
    databaseURL: "https://wedding-f0fc3.firebaseio.com",
    projectId: "wedding-f0fc3",
    storageBucket: "wedding-f0fc3.appspot.com",
    messagingSenderId: "641640372788",
    appId: "1:641640372788:web:0582d2186dd0fc91130861",
    measurementId: "G-093WK6978Q"
  });
}

export const storage = firebase.storage();

export default firebase;
