export type User = {
    avatar: string
    username?: string
    name: string
    email?: string
    privacy?: number
    bio?: string
    status?: string
    friends?: Friend[]
    recipes?: string[]
    subscribedRecipes?: string[]
    pantries?: {
        [id: string]: string
    }
    subscribedPantries?: string[]
}

export type Friend = {
    id: string
    name: string
    avatar: string
}