import React from 'react'
import {Helmet} from "react-helmet"
import {Redirect, useHistory} from 'react-router-dom'
import PantryForm from "./form"
import {Pantry} from "../../types/pantry"
import {PantryContext} from "../../context"
import {appFirestore} from "../../config"

const Add = () => {
    const { id } = React.useContext(PantryContext)
    const {push} = useHistory()
    const pantriesRef = appFirestore.collection(`/pantries`)
    const userRef = appFirestore.doc(`/users/${id}`)

    const handleSubmit = (pantry: Partial<Pantry>) => {
        console.log(pantry)
        pantriesRef.add({...pantry, owner: id})
            .then(newPantryRef => {
                userRef.update({
                    [`pantries.${newPantryRef.id}`]:
                        pantry.name
                    })
                    .then(()=> push(`/`))
                })
            .catch(e => console.error(e))
    }

    if(!id){return <Redirect to={`/home`}/>}

    return (
        <>
            <Helmet title={"Create"}/>
            <PantryForm handleSubmit={handleSubmit}/>
        </>
    )
}

export default Add