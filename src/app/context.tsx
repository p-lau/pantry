import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {Helmet} from "react-helmet"
import {appAuth} from "./config"


const initState = {
    id: undefined,
    theme: [
        "#04081f","#370617","#6a040f", "#9d0208", "#d00000", "#dc2f02", "#E85D04", "#F48C06", "#FAA307", "#FFBA08"
    ]
}

const PantryContext = React.createContext<{theme: string[], id: string | undefined}>(initState)
const AppContext = ({children}: any) =>{
    const [user, loading] = useAuthState(appAuth)


    if(loading){return null}

    const value = {
        ...initState,
        id: user?.uid
    }

    return (
        <PantryContext.Provider value={value}>
            <Helmet titleTemplate={"%s | Pantry"} defaultTitle={`Home`}/>
            {children}
        </PantryContext.Provider>
    )
}

export {AppContext as default, PantryContext}