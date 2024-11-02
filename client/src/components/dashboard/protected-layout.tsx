"use client"

import { useCurrentUser } from '@/hooks/use-currentuser'
import { Loader, Loader2 } from 'lucide-react';
import React from 'react'
import { Card } from '../ui/card';
import AuthCard from '../authCard/auth-card';

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
    const {user ,isLoading} = useCurrentUser();
    if(isLoading){
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='flex items-center justify-center'>
                    <Loader2 className='size-4 mr-2 animate-spin'>

                    </Loader2>
                </div>
            </div>
        )
    }
    if(!user){
        return (
            <div className='flex items-center justify-center h-screen'>
                <AuthCard/>
            </div>
        )
    }

    return <>{children}</>
}

export default ProtectedLayout
