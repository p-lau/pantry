import React, {Dispatch, useContext} from "react"
import {Error} from "./error";
import {useConnect} from "@blockstack/connect"
import usePantry from "../hooks/use-pantry"
import {PantryContext} from "../components/context";
import {IconInput} from "../components/icon-input";

export const UserProfile: React.FC = () => {
    const { userSession } = useConnect().authOptions
    const {profile, setProfile} = useContext(PantryContext)
    const { saveProfile } = usePantry(profile, setProfile as Dispatch<any>)

    return userSession?.isUserSignedIn()?
        <main className={"profile"}>
            <form onSubmit={async (event) => {
                event.preventDefault()
                await saveProfile(userSession, profile)
                window.location.reload()
            }}>
                <h1>Hi, {profile.name}</h1>
                <label>This is you.</label>
                <IconInput src={profile.avatar as string}/>
                <br/>
                <label>Name:</label>
                <input/>
                <br/>
                <label>Bio: </label>
                <input/>
                <br/>
                <button type={"submit"}>Save</button>
            </form>
        </main>
         :
        <Error/>

}