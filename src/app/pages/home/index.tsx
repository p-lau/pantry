import React, {useContext} from "react"
import {Link} from "react-router-dom"
import {Helmet} from "react-helmet"
import {PantryContext} from "../../context"

const Home = () => {
    const {id} = useContext(PantryContext)

    return (
        <>
            <Helmet title={"Welcome"}/>
            <h1>Pantry</h1>
            <p>Welcome to the pantry app. This application stores your food info</p>
            <p>If you suffer from organization with or without another person in the household over food storage, this
                is the app for you.</p>
            <p>List your food here with an expiration date, and we can notify you before the time runs out.</p>
            {!id && <Link to={'/profile/login'}>Click here to sign in</Link>}
        </>
    );
}

export default Home