import  {type PropsWithChildren} from "react";
import clsx from "clsx";
import * as React from "react";

export const Main: React.FC<PropsWithChildren & React.ComponentPropsWithoutRef<"main">> = ({children, className, ...props}) => {
    return (
        <main className={clsx("min-h-screen w-full bg-background", className)} {...props}>{children}</main>
    )
}