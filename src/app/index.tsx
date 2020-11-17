import React from 'react'
import Menu from './components/menu'
import Pages from './pages'
import PantryApp from "./context"
import {toast} from "react-toastify"

toast.configure({
    limit: 1,
    position: "bottom-right",
    closeButton: false,
    draggable: false,
})

const App = () => {
    return (
        <PantryApp>
            <Menu/>
            <Pages/>
        </PantryApp>
    )
}

export default App