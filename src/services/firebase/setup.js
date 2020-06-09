const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyCuezoXUGO4hF9Qs0TSSEWtplJBW1sk8hY",
    authDomain: "wysiwyg-react.firebaseapp.com",
    databaseURL: "https://wysiwyg-react.firebaseio.com",
    projectId: "wysiwyg-react",
    storageBucket: "wysiwyg-react.appspot.com",
    messagingSenderId: "50059132065",
    appId: "1:50059132065:web:94a89e7765eec2c27b44e0",
    measurementId: "G-N62FW2FYC9"
  };


   // Initialize Firebase
   firebase.initializeApp(firebaseConfig);
   firebase.analytics();


   export const db = firebase.firestore();