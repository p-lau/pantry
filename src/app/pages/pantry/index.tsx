import React from 'react'
import {Redirect, Switch, Route, useRouteMatch} from 'react-router-dom'
import {PantryContext} from "../../context"
import {Loading} from "../"

const Edit = React.lazy(() => import('./edit'))
const Add = React.lazy(()=> import('./add'))

const Pantry = () => {
    const {user, loading} = React.useContext(PantryContext)
    const {path} = useRouteMatch()

    if(loading) return <Loading/>
    return (
        <Switch>
            <Route exact path={path} render={() => user ? <Redirect to={`${path}/add`}/> : <Redirect to={`/home`}/>}/>
            <Route exact path={`${path}/add`} component={Add}/>
            <Route exact path={`${path}/:pantryId/edit`} component={Edit}/>
        </Switch>
    )
}

export default Pantry