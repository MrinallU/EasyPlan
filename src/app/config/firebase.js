import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDray1cP6fR0t3Iy5CUImvr5i8tsJ1VWJs",
    authDomain: "easy-plan-mrinallu.vercel.app",
    databaseURL: "https://easyplan.firebaseio.com",
    projectId: "easyplan",
    storageBucket: "easyplan.appspot.com",
    messagingSenderId: "148772041763",
    appId: "1:148772041763:web:1d2a92517345c2b05aad96",
    measurementId: "G-FF5E2DT4J0"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
