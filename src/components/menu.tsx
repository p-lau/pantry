import React, {useContext} from "react"
import {NavLink, Link} from "react-router-dom"
import {Icon} from "./icon"
import {PantryContext} from "./context";
import {useConnect} from "@blockstack/connect";

export const Menu: React.FC = () => {
    const {profile} = useContext(PantryContext)
    const {doOpenAuth, authOptions} = useConnect()
    const {userSession} = authOptions

    return(
        <header id={'menu'}>
            <div id={'brand'} className={'menuItem'}>
                <Link to={'/'}>Pantry</Link>
            </div>
            {userSession?.isUserSignedIn() ?
                    <div id={'profile'} className={'menuItem'}>
                        <NavLink
                            exact
                            role={'link'}
                            to={'/profile/'}
                        >
                            <Icon src={profile.avatar as string || profile.person?.avatarUrl() as string} size={"2rem"}/>
                        </NavLink>
                    </div>
                :
                <div id={"auth-button"} className={'menuItem'}>
                    <button onClick={()=>{doOpenAuth()}} style={{backgroundColor: "#54dece"}}>Log in</button>
                </div>
            }
        </header>
    )
}