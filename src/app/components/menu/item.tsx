import React from 'react'
import styles from './menu.module.css'
import {Link} from "react-router-dom"
type ItemProps = {
    GoTo: () => void
    isSelected: boolean
    path: {
        location: string
        name: string
        photoURL?: string | null
        src: any
    }
}
export const Item = ({GoTo, isSelected, path}: ItemProps) => {

    return (
        <Link
            className={`${styles.item}`}
            title={path.name}
            to={path.location}
            tabIndex={0}
            onKeyDown={({key})=>{
               if (key === "" || key === "Enter" || key === "Spacebar") {
                GoTo()
               }
        }}
              style={isSelected ? {backgroundColor : "#fff"} : undefined}>
            {isSelected ?
                <>{path.src}</> :
                path.photoURL ?
                    <div style={{backgroundImage: `url(${path.photoURL})`}}/> :
                <p style={{color: '#fff'}}>{path.name}</p>}
        </Link>
    )
}