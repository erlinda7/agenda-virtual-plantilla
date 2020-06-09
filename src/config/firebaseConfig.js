import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyCmmgzk9qsBCN2FbZtGfViz4YS5nR2RNCc",
    authDomain: "agendavirtual-f818c.firebaseapp.com",
    databaseURL: "https://agendavirtual-f818c.firebaseio.com",
    projectId: "agendavirtual-f818c",
    storageBucket: "agendavirtual-f818c.appspot.com",
    messagingSenderId: "518216901103",
    appId: "1:518216901103:web:d70b0bdf2073875d0a961a",
    measurementId: "G-96QL6LML9K"
};

firebase.initializeApp(config);
firebase.firestore();

export default firebase;