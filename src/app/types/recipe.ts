interface RecipeIngredient {
    custom?: string
}

type RecipeDirection = {
    order: number
    text: string
}

export type Recipe = {
    _owner: string
    owner: string
    name: string
    category?: string
    cuisine?: string
    method?: string
    cookTime?: string // ISO Date string format
    ingredients: RecipeIngredient[]
    directions: RecipeDirection[]
}