import React from "react"
import {NavLink} from "react-router-dom";

export const Footer: React.FC = () => {
    return(
        <footer>
            <NavLink activeClassName='active' exact to={"/"}>Home</NavLink>
            <NavLink activeClassName='active' exact to={"/browse"}>Browse</NavLink>
        </footer>
    )
}