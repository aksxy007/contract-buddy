import { ConnectAccountModal } from "@/components/modals/connect-account-modal";
import React from "react";

export function ModalProvider({children}:{children:React.ReactNode}){
    return (
        <>
        {children}
        <ConnectAccountModal/>
        </>
    )
}