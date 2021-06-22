import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import "firebase/database";

//example of firebase config object
const firebaseConfig = {
    apiKey: "apikey",
    authDomain: "authDomain",
    databaseURL: "databaseURL",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
var recipesCollection = database.collection("recipes");
var usersCollection = database.collection("users");
// var categories = database.collection("categories");

export { firebase, database, storage, googleAuthProvider, recipesCollection, usersCollection }