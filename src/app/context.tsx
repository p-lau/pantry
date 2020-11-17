import React from 'react'
import {Helmet} from "react-helmet"
import firebase from "firebase/app"
import {toast} from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyAcgohnDO5fDzJgx36PUMmK8obNyxrP7aA",
    authDomain: "p-pantry.firebaseapp.com",
    databaseURL: "https://p-pantry.firebaseio.com",
    projectId: "p-pantry",
    storageBucket: "p-pantry.appspot.com",
    messagingSenderId: "69199919921",
    appId: "1:69199919921:web:1e2120feda53f191ccce10"
}

type App = {
    app?: firebase.app.App,
    auth?: firebase.auth.Auth
    google?: firebase.auth.AuthProvider
    firestore?: firebase.firestore.Firestore
    storage?: firebase.storage.Storage
    database?: firebase.database.Database
    user?: firebase.User,
    theme: string[],
    loading: boolean
}


const theme = [
    "#04081f","#370617","#6a040f", "#9d0208", "#d00000", "#dc2f02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08"
]

const init = { theme, loading: true }

const PantryContext = React.createContext<App>(init)
const AppContext = ({children}: any) =>{
    const [{app, database, firestore, storage, auth, user, theme, google, loading}, setApp] = React.useState<App>(init)

    const updateApp = (key: string, value: any) => {
        setApp(p => ({...p, [key]:value}))
    }

    const setTheme = (theme: string[]) => {
        updateApp("theme", theme)
    }

    React.useEffect(() => {
        if(!app){
            // Initiate app if it hasn't already
            updateApp("app", firebase.initializeApp(firebaseConfig))
        } else {
            // Lazy load firebase modules
            import("firebase/auth")
                .then(()=>{
                    updateApp("auth", firebase.auth())
                    firebase.auth().onAuthStateChanged((user)=>{
                        updateApp("user", user)
                        updateApp("loading", false)
                    })
                    firebase.auth().useDeviceLanguage()
                    const googleProvider = new firebase.auth.GoogleAuthProvider().addScope("profile")
                    updateApp("google", googleProvider)
                })
                .catch(()=>{
                    console.error("Firebase Auth not loaded")
                })
            import("firebase/firestore")
                .then(()=>{
                    updateApp("firestore", firebase.firestore())
                    firebase.firestore()
                        .enablePersistence({synchronizeTabs: true})
                    firebase.firestore()
                        .settings({ignoreUndefinedProperties: true})
                })
                .catch((e)=>{
                    console.info(e.message)
                })
            import("firebase/storage")
                .then(()=>{
                    updateApp("storage", firebase.storage())
                })
                .catch(()=>{
                    console.error("Firebase Storage not loaded")
                })
            import("firebase/database")
                .then(()=>{
                    updateApp("database", firebase.database())
                    const connectedRef = firebase.database().ref('.info/connected')
                    connectedRef.on("value", (s) => {
                        if (s.val()) {
                            toast.isActive("connectivity") ?
                            toast.update("connectivity",{render: "Connected to the server"})
                                :
                            toast.dark("Connected", {toastId: "connectivity"})
                        } else {
                            toast.isActive("connectivity") ?
                            toast.update("connectivity",{render: "Disconnected from the server"})
                                :
                            toast.dark("Disconnected", {toastId: "connectivity"})

                        }
                    })
                })
                .catch(()=>{
                    console.error("Firebase Realtime Database not loaded")
                })
        }
    }, [app])


    const value = {
        app,
        database,
        firestore,
        storage,
        auth,
        google,
        theme,
        user,
        loading,
        setTheme
    }

    return (
        <PantryContext.Provider value={value}>
            <Helmet titleTemplate={"%s | Pantry"} defaultTitle={`Home`}/>
            {children}
        </PantryContext.Provider>
    )
}

export {AppContext as default, PantryContext}