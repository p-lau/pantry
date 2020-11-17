import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom"
import {Helmet} from "react-helmet"

const Recipe = React.lazy(()=> import('./recipe'))
const Home = React.lazy(() => import('./home'))
const Explore = React.lazy(() => import('./explore'))
const Pantry = React.lazy(() => import('./pantry'))
const Profile = React.lazy(()=> import('./profile'))

const Error = ({e = "404", m = "Not Found"}: {e?: string, m?: string}) => {
    return(
        <section className={'error'}>
            <Helmet title={e}/>
            <h1 className={'dangerBlur'}>{e}</h1>
            <p>{m}</p>
        </section>
    )
}

const Loading = () => {
    return (
        <section className={'loading'}>
            <Helmet title={'Loading...'}/>
            <h1 className={'waitingBlur'}>Loading</h1>
        </section>
    )
}

const Pages = () => {
    return(
        <main>
            <div className={'content'}>
                <React.Suspense fallback={<Loading/>}>
                    <Switch>
                        <Route exact path={"/"} render={()=><Redirect to={'/home'}/>}/>
                        <Route path={"/home"} component={Home}/>
                        <Route path={"/explore"} component={Explore}/>
                        <Route path={"/pantry"} component={Pantry}/>
                        <Route path={"/recipe"} component={Recipe}/>
                        <Route path={"/profile"} component={Profile}/>
                        <Route path={"*"} component={Error}/>
                    </Switch>
                </React.Suspense>
            </div>
        </main>
    )
}

export {Pages as default, Loading, Error}