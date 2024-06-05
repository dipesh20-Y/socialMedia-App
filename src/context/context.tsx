'use client'
import React from 'react'
import { createContext, useContext, useState } from 'react'


export const MediaContext = createContext<{tokens:{
    accessToken:string,
    refreshToken: string,
    role:string
}, setTokens: any}>({
    tokens:{
        accessToken:'',
        refreshToken:"",
        role:""
    },
    setTokens: ()=>{}
})

export const useMedia = () =>{
    return useContext(MediaContext)
}

type MediaContextProviderProps = {
    children: React.ReactNode
}

export const MediaProvider = ({children}:MediaContextProviderProps) => {
    const [tokens, setTokens] = useState({
        accessToken:'',
        refreshToken:"",
        role:""
    })

const mediaContextValue ={
    tokens,
    setTokens
}

return (
    <MediaContext.Provider value={mediaContextValue}>
            {children}
    </MediaContext.Provider>
)
}