import React from 'react'
import {Helmet} from "react-helmet"
import {useParams, Redirect} from 'react-router-dom'
import {PantryContext} from "../../context"
import {appFirestore} from "../../config"
import PantryForm from "./form"
import {Pantry} from "../../types/pantry"
import {useDocumentDataOnce} from "react-firebase-hooks/firestore"
import {Error, Loading} from "../"

const Edit = () => {
    const { id } = React.useContext(PantryContext)
    const { pantryId }: any = useParams()
    const pantryRef = appFirestore.doc(`/pantries/${pantryId}`)
    const userRef = appFirestore.doc(`/users/${id}`)
    const [pantry, loading, error]: [Pantry | undefined, boolean, any] = useDocumentDataOnce(pantryRef)

    const handleSubmit = (pantry: Partial<Pantry>)=>{
        appFirestore.runTransaction(transaction => {
            return transaction.get(pantryRef).then((pantryDoc)=>{
                if(!pantryDoc.exists){
                    throw Error({e:"Document doesn't exist", m:"The pantry does not exist"})
                } else {
                    transaction.update(pantryRef, pantry)
                    transaction.update(userRef, {[`pantries.${pantryId}`]: pantry.name})
                }
            })
        })
            .then(()=>console.log(`Pantry update complete`))
            .catch((e)=>console.error(e))
    }

    // Checks if user can edit this pantry (as owner or shared user)
     return(
        <>
            {loading && <Loading/>}
            {error && <Error/>}
            {pantry && pantry?.owner !== id && !pantry?.sharedWith?.includes(id as string) && <Redirect to={`/`}/>}
            {pantry && <><Helmet title={"Edit"}/><PantryForm editing={pantry} handleSubmit={handleSubmit}/></>}
        </>
    )
}

export default Edit