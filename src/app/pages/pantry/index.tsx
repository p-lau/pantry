import React from 'react'
import {Redirect, Switch, Route, useRouteMatch} from 'react-router-dom'
import {PantryContext} from "../../context"

const Edit = React.lazy(() => import('./edit'))
const Add = React.lazy(()=> import('./add'))

const Pantry = () => {
    const {user} = React.useContext(PantryContext)
    const {path} = useRouteMatch()

    if(!user?.uid){return <Redirect to={`/home`}/>}
    return (
        <Switch>
            <Route exact path={path} render={() => <Redirect to={`${path}/add`}/>}/>
            <Route exact path={`${path}/add`} component={Add}/>
            <Route exact path={`${path}/:pantryId/edit`} component={Edit}/>
        </Switch>
    )
}

export default Pantry