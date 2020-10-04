import {Dispatch, SetStateAction} from "react"
import {ProfileState} from "../components/context"
import {v4 as uuid} from "uuid"
import {Person, UserSession} from "blockstack";
import {UserData} from "blockstack/lib/auth/authApp";

const PROFILE = 'profile.json'
const PUBLIC = 'public.json'


export type UsePantry = {
    loginPantry: () => void
    saveProfile:() => void
    fetchProfile:() => void
    deletePantry:() => void
    fetchPantry:() => void
    savePantry:() => void
}

type Pantry = {
    _id: string
    name: string
    ingredients: Ingredient[]
    isPublic: boolean
}

export type Ingredient = {
    _id: string
    name: string
    type: string
    timestamp: Date | number
}

export const defaultPantry: Pantry = {
    _id: uuid(),
    name: "",
    ingredients: [],
    isPublic: false
}

export const defaultIngredient: Ingredient = {
    _id: uuid(),
    name: "",
    type: "",
    timestamp: new Date()
}

const usePantry = (profile: ProfileState, setProfile: Dispatch<SetStateAction<ProfileState>>) => {
    /**
     Uploads a Profile via Blockstack function
     @param userSession
     @param {ProfileState} p - The profile to be saved in Blockstack storage hub
     */
    const saveProfile = async (userSession: UserSession, p: ProfileState) => {
        console.log("Updating profile...")
        userSession.putFile(PROFILE, JSON.stringify(p))
            .then(() => {
                console.log("Updated profile!")
                let pantries: string[] = [], recipes: string[] = []
                for(const key in p.pantries){
                    if (p.pantries.hasOwnProperty(key) && !p.pantries[key]){
                        pantries.concat(key)
                    }
                }
                for(const key in p.recipes){
                    if (p.recipes.hasOwnProperty(key) && !p.recipes[key]){
                        recipes.concat(key)
                    }
                }
                console.log("Updating public profile...")
                userSession.putFile(PUBLIC, JSON.stringify({pantries, recipes}), {encrypt: p.encrypt})
                console.log("Updated your public profile!")
            })
            .then(()=> {
                setProfile?.({...profile, pantries: p.pantries, recipes: p.recipes})
            })
            .catch(e => console.error('Could not fully update :', e))
    }

    // Takes in a username to return a PantryProfile; if not found, returns undefined
    const fetchProfile = async (userSession: UserSession, decrypt = false, username?: string): Promise<ProfileState > => {
        return username ?
            await JSON.parse(await userSession.getFile(PUBLIC, {decrypt, username}) as string)
            :
            await JSON.parse(await userSession.getFile(PROFILE, {decrypt: true}) as string)
    }

    // TODO
    const publishPantry = async (userSession: UserSession, p: Pantry) => {
        await userSession.putFile(`/public/${p._id}.json`, JSON.stringify(p))
            .then(()=>{
                console.log("Published!")
            })
            .catch(e => console.error("Publish Error: ", e))

    }

    const loginPantry = async (userSession: UserSession): Promise<void> => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn()
                .then(async (userData: UserData) => {
                    const person = new Person(userData.profile)
                    const p = await fetchProfile(userSession) as ProfileState
                    setProfile((prev: ProfileState) => {
                        return {...prev, ...p, userData, person, loading: false}
                    })
                })
        } else if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData()
            const person = new Person(userData.profile)
            const p = await fetchProfile(userSession) as ProfileState
            setProfile((prev: ProfileState) =>
            {return {...prev, ...p, userData, person, loading: false}})
        }
    }

    // Saves/Updates a pantry via Blockstack and saves the ID as an address
    const savePantry = async (userSession: UserSession,p: Pantry): Promise<void> => {
        console.log("Uploading...")
        // Upload the file
        await userSession.putFile(`/pantry/${p._id}.json`, JSON.stringify(p),{encrypt: !p.isPublic})
            .then(async () => {
                // Updates both the user's lists
                await saveProfile(userSession, {...profile, pantries: {...profile.pantries , [p._id]: !p.isPublic}})
            })
            .then(async () =>{
                if (p.isPublic) await publishPantry(userSession, p)
            })
            .catch(()=> {
                console.error("Could not save pantry")
            })
    }

    /**
     Deletes UsePantry via Blockstack and updates both the user's public and private lists.

     If no tasks are found, and no username is provided, then the default tasks are returned.
     If tasks are found, we check to see if they are public.
     @function fetchPantry
     @param userSession
     @param {string} id - the id address for a specific UsePantry.
     @param {string} username - the id address for a specific UsePantry.
     @returns {Promise<Pantry | undefined>}
     */
    const fetchPantry = async (userSession: UserSession, id: string, username?: string): Promise<Pantry | undefined> => {
            return JSON.parse(
                await userSession.getFile(`/pantry/${id}.json`, {decrypt: !username, username}) as string
            ).catch(() => {
                console.log("Couldn't find the pantry")
                return undefined
            })
        }

    /**
     Deletes a pantry via Blockstack and updates both the user's public and private lists.

     If no tasks are found, and no username is provided, then the default tasks are returned.
     If tasks are found, we check to see if they are public.
     @returns {void}
     * @param userSession
     * @param id
     * @param recipes
     * @param pantries
     */
    const deletePantry = async (userSession: UserSession, id: string, {recipes, pantries} = profile): Promise<void> => {
        await userSession.deleteFile(`/pantry/${id}.json`)
            .then(async ()=>{
                profile.pantries?.hasOwnProperty(id)
                await saveProfile(userSession, {pantries, recipes})
            })
            .catch(()=>{
                console.log("Couldn't find the pantry")
            })
    }

    return{
        loginPantry,
        saveProfile,
        fetchProfile,
        deletePantry,
        fetchPantry,
        savePantry,
    }
}

export default usePantry