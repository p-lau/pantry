import React from 'react'
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {Helmet} from 'react-helmet'
import {Link, useParams} from 'react-router-dom'

import {PantryContext} from '../../context'
import {appAuth, appFirestore} from '../../config'
import {Error, Loading} from '../index'
import styles from "./profile.module.css"
import {User} from "../../types/user";


const View = () => {
    const {id} = React.useContext(PantryContext)
    const {user} = useParams<{ user:string }>()
    const [value, loading, error] = useDocumentDataOnce(appFirestore.doc(`/users/${user}`))


    if(loading){return(
        <>
            <Loading/>
        </>
    )}
    if(error || !value){return(
        <>
            <Error e={error?.name} m={error?.message || "User not found."}/>
        </>
    )} else {
        const {avatar, status, name, pantries} = value as User
        return(
        <>
            <Helmet title={`${name}'s Profile`}/>
            <h1>{name}</h1>
            <div title={name} className={`${styles.avatar}`} style={{backgroundImage: `url(${avatar})`}}/>
            <section id={'status'}>
                <h2>Status</h2>
                <p>{status}</p>
            </section>
            <section id={'pantries'}>
                <h2>Pantries</h2>
                <ul>
                    { pantries ? Object.entries(pantries).map(([id, name]) =>
                        <Link to={`/pantry/${id}/edit`} key={id}>
                            <li>{name}</li>
                        </Link>) : null}
                </ul>
            </section>
            {user === id &&
            <section>
                <Link
                    title={'Edit your profile'}
                    to={`/profile/${user}/edit`}
                    children={<button className={'btn info-btn'}>Edit Profile</button>}
                />
                <Link to={`/home`}
                      title={'Sign out of Pantry'}
                      children={
                          <button
                              className={'btn danger-btn'}
                              onClick={()=>{appAuth.signOut().catch(e => console.log(e))}}
                              children={'Sign out'}
                          />}
                />
            </section>}
        </>
    )}
}

export default View