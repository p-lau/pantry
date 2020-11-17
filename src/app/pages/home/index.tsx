import React from "react"
import {Link} from "react-router-dom"
import {Helmet} from "react-helmet"
import {PantryContext} from "../../context"
import {Loading} from "../"

const Home = () => {
    const {user, database, loading} = React.useContext(PantryContext)
    if(loading) return <Loading/>
    return (
        <>
            <Helmet title={"Welcome"}/>
            <h1>Pantry</h1>
            <p>Welcome to the pantry app. This application stores your food info</p>
            <p>If you suffer from organization with or without another person in the household over food storage, this
                is the app for you.</p>
            <p>List your food here with an expiration date, and we can notify you before the time runs out.</p>
            {!user?.uid && <Link to={'/profile/login'}>Click here to sign in</Link>}
            <button className={'btn'} onClick={()=>{
                database?.goOnline()
            }}>Go Online</button>
            <button className={'btn'} onClick={()=>{
                database?.goOffline()
            }}>Go Offline</button>
        </>
    );
}

export default Home