import React from 'react'
import {useHistory, useLocation} from "react-router-dom"
import {Item} from "./item"
import styles from './menu.module.css'
import {PantryContext} from "../../context"
import {ReactComponent as Profile} from "../../assets/icons/profile.svg"
import {ReactComponent as Home} from "../../assets/icons/home.svg"
import {ReactComponent as Explore} from "../../assets/icons/search.svg"
import {ReactComponent as Recipe} from "../../assets/icons/recipe.svg"
import {ReactComponent as Pantry} from "../../assets/icons/pantry.svg"
import {appAuth} from "../../config";

const Menu = () => {
    const history = useHistory()
    const location = useLocation()
    const {theme, id} = React.useContext(PantryContext)
    const photoURL = appAuth.currentUser?.photoURL
    const paths = [
        {location: "/profile", name: id ? "Profile" : "Login", src: <Profile/>, photoURL},
        {location: "/home", name: "Home", src: <Home/>},
        {location: "/explore", name: "Explore", src: <Explore/>},
    ]
    const authPaths = [
        ...paths,
        {location: "/recipe/", name: "Recipe", src: <Recipe/>},
        {location: "/pantry/", name: "Pantry", src: <Pantry/>},
    ]

    return (
            <header id={`header`} className={styles.header} style={{backgroundColor: `#002`}}>
                <nav className={styles.nav}>
                    <ul className={styles.ul}>
                        {(id ? authPaths : paths).map((path, index) => (
                            <li key={index} style={{backgroundColor: theme[index]}}>
                                <Item
                                    path={path}
                                    isSelected={location.pathname.startsWith(path.location)}
                                    GoTo={() => {
                                        history.push(path.location)
                                    }}/>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>
    )
}

export default Menu