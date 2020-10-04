import React, {
    useEffect,
    createContext, Dispatch, SetStateAction,
    useState
} from 'react'
import {AuthOptions, Connect} from "@blockstack/connect";
import {AppConfig, Person, UserSession} from "blockstack";
import {UserData} from "blockstack/lib/auth/authApp";
import usePantry from "../hooks/use-pantry";

export interface ProfileState {
    loading?: boolean
    name?: string
    bio?: string
    avatar?: string
    person?: Person
    userData?: UserData
    pantries?: PantryCollection
    recipes?: PantryCollection
    encrypt?: boolean
}

export type PantryCollection = {
    [id: string]: boolean
}

const defaultProfile: ProfileState = {
    loading: true
}

export const PantryContext = createContext<{profile: ProfileState, setProfile?: Dispatch<SetStateAction<ProfileState>>}>({profile: defaultProfile})

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession: UserSession = new UserSession({ appConfig })

const Pantry = ({children}: {children: any}) => {
    const [profile, setProfile] = useState(defaultProfile)

    const {loginPantry} = usePantry(profile, setProfile)

    const authOptions: AuthOptions = {
        appDetails: {
            name: "Pantry",
            icon: window.location.origin + '/logo512.png',
        },
        userSession,
        finished: (async ({userSession, authResponse})=> {
            console.log(authResponse, userSession)
        })
    }

    console.log(profile)
    useEffect(() => {
        if(profile.loading){loginPantry(userSession).then(r => null)}
    }, [loginPantry, profile])

    return(
            <PantryContext.Provider value={{profile, setProfile}}>
                <Connect authOptions={authOptions}>
                    {children}
                </Connect>
            </PantryContext.Provider>
    )
}
export default Pantry
