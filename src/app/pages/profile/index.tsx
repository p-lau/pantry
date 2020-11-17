import React from 'react'
import {Redirect, Switch, Route, useRouteMatch} from 'react-router-dom'
import {PantryContext} from "../../context"
import {Loading} from "../"

const Edit = React.lazy(() => import('./edit'))
const View = React.lazy(() => import('./view'))
const Login = React.lazy(()=> import('./login'))
const Profile = () => {
    const { user, auth, loading } = React.useContext(PantryContext)
    const { path } = useRouteMatch()

    if(loading) return <Loading/>

    return (
        <Switch>
            <Route exact path={path} render={() => {
                // Try to load everything before rendering
                if(auth && user) return <Redirect to={`${path}/${user?.uid}`}/>
                else return <Redirect to={`${path}/login`}/>
            }}/>
            <Route exact path={`${path}/login`} component={Login}/>
            <Route exact path={`${path}/:userId`} component={View}/>
            <Route exact path={`${path}/:userId/edit`} component={Edit}/>
        </Switch>
    )
}

export default Profile