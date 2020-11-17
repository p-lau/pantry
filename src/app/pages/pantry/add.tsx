import React from 'react'
import {Helmet} from "react-helmet"
import {Redirect, useHistory} from 'react-router-dom'
import PantryForm from "./form"
import {Pantry} from "../../types/pantry"
import {PantryContext} from "../../context"
import {toast} from "react-toastify"

const Add = () => {
    const { user, firestore } = React.useContext(PantryContext)
    const {push} = useHistory()
    const pantriesRef = firestore?.collection(`/pantries`)
    const userRef = firestore?.doc(`/users/${user?.uid}`)

    const handleSubmit = (pantry: Partial<Pantry>) => {
        console.log(pantry)
        pantriesRef?.add({...pantry, owner: user?.uid})
            .then(newPantryRef => {
                userRef?.update({
                    [`pantries.${newPantryRef.id}`]:
                        {
                            name: pantry.name,
                            thumbnail: pantry.thumbnail
                        }
                    })
                    .then(()=> {
                        console.log(`Pantry update complete`)
                        push(`/profile`)
                    })
                })
            .catch(e => toast.error(e))
    }

    if(!user?.uid){return <Redirect to={`/home`}/>}

    return (
        <>
            <Helmet title={"Create"}/>
            <PantryForm handleSubmit={handleSubmit}/>
        </>
    )
}

export default Add