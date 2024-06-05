'use client'

export const AccessToken = ()=>{
    const accesstoken = localStorage.getItem('aT')
    return accesstoken;
}

export const RefreshToken = ()=>{
    const refreshtoken = localStorage.getItem('rT')
    return refreshtoken;
}

export const removeTokens=()=>{
    localStorage.remove('aT')
    localStorage.remove('rT')
    console.log('tokens removed successfully')
}
