import React from 'react'
import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {Helmet} from 'react-helmet'
import {Link, useParams} from 'react-router-dom'

import {PantryContext} from '../../context'
import {Error, Loading} from '../index'
import styles from "./profile.module.css"
import {User} from "../../types/user";


const View = () => {
    const { user, auth, firestore } = React.useContext(PantryContext)
    const {userId} = useParams<{ userId:string }>()
    const [value, loading, error] = useDocumentDataOnce(firestore?.doc(`/users/${userId}`))

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
        const {status, name, pantries, avatar} = value as User
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
                <ul className={styles.pantries}>
                    { pantries ? Object.entries(pantries).map(([id, name]) =>
                        <li key={id}>
                            <Link to={`/pantry/${id}/edit`}>{name}</Link>
                        </li>) : null}
                </ul>
            </section>
            {userId === user?.uid &&
            <section>
                <Link
                    title={'Edit your profile'}
                    to={`/profile/${userId}/edit`}
                    children={<button className={'btn info-btn'}>Edit Profile</button>}
                />
                <Link to={`/home`}
                      title={'Sign out of Pantry'}
                      children={
                          <button
                              className={'btn danger-btn'}
                              onClick={()=>{auth?.signOut().catch(e => console.log(e))}}
                              children={'Sign out'}
                          />}
                />
            </section>}
        </>
    )}
}

export default View