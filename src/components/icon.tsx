import React, {FunctionComponent, PropsWithChildren} from "react"

interface IconProp {
    src: string ,
    size: string | number,

}

export const Icon: FunctionComponent<IconProp> = ({src='5rem', size}: PropsWithChildren<IconProp>) => {
    return(
        <div style={{backgroundColor: "rgba(255,255,255,0.3)" ,borderRadius: "50%", height:size, width:size, backgroundImage:`url(${src})`, backgroundSize: "cover"}}/>
    )
}