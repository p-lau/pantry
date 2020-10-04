import React, {FunctionComponent, PropsWithChildren} from "react"

export const Card: FunctionComponent = (props: PropsWithChildren<any>) => {
    return(
        <div style={{minHeight: "90vh"}}>
            {props.children}
        </div>
    )
}