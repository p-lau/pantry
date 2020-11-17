import firebase from "firebase/app"

export interface PantryIngredient {
    name: string
    type?: string
    expires?: firebase.firestore.Timestamp
}

export type Pantry = {
    thumbnail?: string
    owner: string
    sharedWith?: string[]
    name: string
    note?: string
    ingredients: PantryIngredient[]
}