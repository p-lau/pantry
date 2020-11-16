import React from 'react'
import {Redirect, Switch, Route, useRouteMatch} from 'react-router-dom'
import {PantryContext} from "../../context"

const Edit = React.lazy(() => import('./edit'))
const View = React.lazy(() => import('./view'))
const Login = React.lazy(()=> import('./login'))
const Profile = () => {
    const { user } = React.useContext(PantryContext)
    const { path } = useRouteMatch()

    return (
        <Switch>
            <Route exact path={path} render={() => user ? <Redirect to={`${path}/${user.uid}`}/> : <Redirect to={`/profile/login`}/>}/>
            <Route exact path={`${path}/login`} component={Login}/>
            <Route exact path={`${path}/:userId`} component={View}/>
            <Route exact path={`${path}/:userId/edit`} component={Edit}/>
        </Switch>
    )
}

export default Profile