import axios from "axios"
import { signup } from "@/app/signup/page"
import { login } from "@/app/login/page"
import axiosInstance from "./axiosInstance"
import {post} from "@/components/card/PostBody"

export const postAuth = async ({author, email, userName, password}: signup) =>{
    const res = await axios.post('http://localhost:5000/api/auth/signup',
        {author, email, userName, password}
    )
    res && console.log(res)
    return res.data
}

export const loginPost = async ({userName, password} : login)=>{
    const res= await axios.post('http://localhost:5000/api/auth/signin',
        {userName, password}
    )
    return res
   
}

export const logout = async ()=>{
    const res = await axiosInstance.post('/auth/logout')
    return res 
}

export const fetchAuthor = async ()=>{
    const res = await axiosInstance.get('users/author')
    res && console.log(res)
    return res.data
   
}

export const uploadPost = async (data:post)=>{
    console.log(data.image)
    const res = await axiosInstance.post('/posts', data.image)
}

export const fetchAllUsers = async ()=>{
    const res= await axios.get('http://localhost:5000/api/users')
    return res.data
}