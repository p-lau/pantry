import React from 'react'
import Menu from './components/menu'
import Pages from './pages'
import PantryApp from "./context"
import {toast, Zoom} from "react-toastify"

toast.configure({
    position: "bottom-right",
    closeButton: false,
    draggable: false,
    transition: Zoom
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