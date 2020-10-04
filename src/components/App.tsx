import '../App.css'
import React, {FunctionComponent} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Landing} from "../pages/landing"
import {Error} from "../pages/error"
import {UserProfile} from "../pages/userProfile"
import {Menu} from "./menu"
import {Footer} from "./footer"
import Pantry from "./context"

export const App: FunctionComponent = () => {
    return (
        <Pantry>
            <div id={"app"}>
                <BrowserRouter>
                    <Menu/>
                    <Switch>
                        <Route exact path={"/"} component={Landing}/>
                        <Route exact path={"/profile"} component={UserProfile}/>
                        <Route path={"*"} component={Error}/>
                    </Switch>
                    <Footer/>
                </BrowserRouter>
            </div>
        </Pantry>
    )
}