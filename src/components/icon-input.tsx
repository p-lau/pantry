import React, {FunctionComponent} from "react"
import {Icon} from "./icon"

export const IconInput: FunctionComponent<any> = ({onChange, avatar, callback}) => {
    return(
        <label htmlFor={'file'} className={'file'}>
            <input type={'file'} accept="image/*" name={'avatar'} onChange={(e: any) => {
                e.preventDefault()
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const text = (e.target?.result)
                    if (typeof text === "string") {
                        return callback
                    }
                    console.log("updated avatar")
                };
                if (e.target.files) {
                    return (e.target.files[0].size > 2500000) ?
                        alert("File size should be less than 2MB!") :
                        reader.readAsDataURL(e.target.files[0])
                }
            }}/>
            <Icon src={avatar as string} size={"10rem"}/>
        </label>
    )
}