import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/database"
import "firebase/storage"
import {toast} from "react-toastify"

const firebaseConfig = {
    apiKey: "AIzaSyAcgohnDO5fDzJgx36PUMmK8obNyxrP7aA",
    authDomain: "p-pantry.firebaseapp.com",
    databaseURL: "https://p-pantry.firebaseio.com",
    projectId: "p-pantry",
    storageBucket: "p-pantry.appspot.com",
    messagingSenderId: "69199919921",
    appId: "1:69199919921:web:1e2120feda53f191ccce10"
}
const app = firebase.initializeApp(firebaseConfig)

// Firebase Auth
const appAuth = app.auth()

const googleProvider = new firebase.auth.GoogleAuthProvider().addScope("profile")

// Firebase Firestore
const appFirestore = app.firestore()
appAuth.useDeviceLanguage()
appFirestore.enablePersistence({synchronizeTabs: true}).catch((err: any) => toast.error(err))
// Firebase Realtime Database
const appDatabase = app.database()

// Firebase Storage
const appStorage = app.storage()

export {appFirestore, appDatabase, appStorage, appAuth, googleProvider}