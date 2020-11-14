import firebase from "firebase";
import Timestamp = firebase.firestore.Timestamp

export interface PantryIngredient {
    name: string
    type?: string
    expires?: Timestamp
}

export type Pantry = {
    owner: string
    sharedWith?: string[]
    name: string
    note?: string
    ingredients: PantryIngredient[]
}