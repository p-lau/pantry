export type User = {
    name: string
    email?: string
    avatar?: string
    privacy: number
    bio?: string
    status?: string
    friends?: Friend[]
    recipes?: string[]
    subscribedRecipes?: string[]
    pantries?: {
        [id: string]: string,
    }
    subscribedPantries?: string[]
}

export type Friend = {
    id: string,

}