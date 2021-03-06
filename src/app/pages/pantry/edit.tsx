import React from 'react'
import {Helmet} from "react-helmet"
import {useParams, Redirect, useHistory} from 'react-router-dom'
import {PantryContext} from "../../context"
import PantryForm from "./form"
import {Pantry} from "../../types/pantry"
import {useDocumentDataOnce} from "react-firebase-hooks/firestore"
import {Error, Loading} from "../"
import {toast} from "react-toastify"

const Edit = () => {
    const { user, firestore } = React.useContext(PantryContext)
    const { pantryId }: any = useParams()
    const {push} = useHistory()
    const pantryRef = firestore?.doc(`/pantries/${pantryId}`)
    const userRef = firestore?.doc(`/users/${user?.uid}`)
    const [pantry, loading, error]: [Pantry | undefined, boolean, any] = useDocumentDataOnce(pantryRef)

    const handleSubmit = (pantry: Partial<Pantry>)=>{
        firestore?.runTransaction(transaction => {
            return transaction.get(pantryRef!).then((pantryDoc)=>{
                if(!pantryDoc.exists){
                    throw Error({e:"Document doesn't exist", m:"The pantry does not exist"})
                } else {
                    transaction.update(pantryRef!, pantry)
                    transaction.update(userRef!, {[`pantries.${pantryId}`]: pantry.name})
                }
            })
        })
            .then(()=> {
                toast.success(`Pantry update complete`)
                push(`/profile`)
            })
            .catch((e)=>toast.error(e))
    }

    // Checks if user can edit this pantry (as owner or shared user)
     return(
        <>
            {loading && <Loading/>}
            {error && <Error/>}
            {pantry && pantry?.owner !== user?.uid && !pantry?.sharedWith?.includes(user?.uid as string) && <Redirect to={`/`}/>}
            {pantry && <><Helmet title={"Edit"}/><PantryForm editing={pantry} handleSubmit={handleSubmit}/></>}
        </>
    )
}

export default Edit