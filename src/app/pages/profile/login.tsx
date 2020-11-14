import React, {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {Helmet} from "react-helmet"
import {PantryContext} from "../../context"
import styles from "./profile.module.css"
import {ReactComponent as Logo} from "../../assets/icons/google-color.svg";
import {Field, Form, Formik} from "formik"
import {appAuth, googleProvider, appFirestore} from "../../config"
import {toast} from "react-toastify"

export const GoogleLogin = () => {
    return (
        <button className={styles.google + " btn"} onClick={event => {
            event.preventDefault()
            appAuth.signInWithPopup(googleProvider)
                .then(({user, additionalUserInfo}) => {
                    // if new user, create userdata
                    const id = user?.uid
                    const isNew = additionalUserInfo?.isNewUser
                    if(isNew){appFirestore.doc(`/users/${id}`).set({
                        subscribedPantries: [],
                        subscribedRecipes: [],
                        name: user?.displayName || "Pantry User",
                        avatar: user?.photoURL,
                        status: "New"
                    }).then(()=> toast.success('Welcome to pantry!'))}
                })
                .catch( error => {toast.error(error.message)})
        }}>
            <Logo/>
            Google
        </button>
    )
}

const Login = () => {
    const {id} = useContext(PantryContext)
    const [error, setError] = React.useState("")
    if(id){return <Redirect to={'/home'}/>}

    return (
        <>
            <Helmet title={"Login"}/>
            <div className={styles.login}>
                <Formik initialValues={{email:'', password:''}} onSubmit={({email, password})=>{
                    appAuth.signInWithEmailAndPassword(email, password)
                        .catch(e => {setError(e.message)})
                }}>
                    <Form>
                        <h1>Sign in</h1>
                        <p style={{color: "salmon"}}>{error}</p>
                        <label htmlFor={'email'}>
                            <small>Enter your email</small>
                            <Field id={'email'} autoComplete={"email"} name={'email'} type={"email"} placeholder={"Email"} size={40} required/>
                        </label>
                        <label htmlFor={'password'}>
                            <small>Enter a password</small>
                            <Field id={'password'} type={"password"} name={'password'} placeholder={"Password"} size={40} required/>
                        </label>
                        <button className={'btn success-btn'} type={"submit"}>Sign in</button>
                    </Form>
                </Formik>
                <div className={styles.separator}>
                    <div className={styles.line}/>
                    <p>or with</p>
                    <div className={styles.line}/>
                </div>
                <GoogleLogin/>
            </div>
        </>
    )
}

export default Login