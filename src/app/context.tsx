import React from 'react'
import {Helmet} from "react-helmet"
import firebase from "firebase/app"

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
    theme: string[]
}


const theme = [
    "#04081f","#370617","#6a040f", "#9d0208", "#d00000", "#dc2f02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08"
]

const init = { theme }

const PantryContext = React.createContext<App>(init)
const AppContext = ({children}: any) =>{
    const [{app, database, firestore, storage, auth, user, theme, google}, setApp] = React.useState<App>(init)

    const updateApp = (key: string, value: any) => {
        setApp(p => ({...p, [key]:value}))
    }

    const setTheme = (theme: string[]) => {
        updateApp("theme", theme)
    }

    // Lazy-load firebase
    React.useEffect(() => {

        if(!app){
            updateApp("app", firebase.initializeApp(firebaseConfig))
        } else {
            import("firebase/auth")
                .then(()=>{
                    updateApp("auth", firebase.auth())
                    firebase.auth().onAuthStateChanged((user)=>{
                        updateApp("user", user)
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