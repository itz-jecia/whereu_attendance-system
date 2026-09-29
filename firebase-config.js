const firebaseConfig = {
    apiKey: "AIzaSyC0tjdQg_VFTtRggLN9p8Sg374RTrTkF1g",
    authDomain: "attendance-whereu.firebaseapp.com",
    databaseURL: "https://attendance-whereu-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "attendance-whereu",
    storageBucket: "attendance-whereu.firebasestorage.app",
    messagingSenderId: "763851702103",
    appId: "1:763851702103:web:7c3382b74d4ba7966d0812"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();