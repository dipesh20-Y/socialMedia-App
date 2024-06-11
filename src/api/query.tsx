import axios from "axios";
import { signup } from "@/app/signup/page";
import { login } from "@/app/login/page";
import axiosInstance from "./axiosInstance";
import { post } from "@/components/card/PostBody";
import { updatePostInterface } from "@/components/card/Card";
import {comment} from '../app/posts/[slug]/page'

export const postAuth = async ({
  author,
  email,
  userName,
  password,
}: signup) => {
  const res = await axios.post("http://localhost:5000/api/auth/signup", {
    author,
    email,
    userName,
    password,
  });
  res && console.log(res);
  return res.data;
};

interface commentInput{
  postId: number,
  data:comment
}

export const loginPost = async ({ userName, password }: login) => {
  const res = await axios.post("http://localhost:5000/api/auth/signin", {
    userName,
    password,
  });
  return res;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res;
};

export const fetchAuthor = async () => {
  const res = await axiosInstance.get("users/author");
  res && console.log(res);
  return res.data;
};

export const uploadPost = async (data: post) => {
//   const { content } = data;

  const res = await axiosInstance.post("/posts/upload", data);
};

export const fetchAllUsers = async () => {
  const res = await axios.get("http://localhost:5000/api/users");
  return res.data;
};

export const fetchAllPosts = async ()=>{
    const res = await axios.get('http://localhost:5000/api/posts')
    return res.data
}

export const fetchPostById = async (id: string)=>{
  const res = await axios.get(`http://localhost:5000/api/posts/${id}`)
  return res.data
}

export const deletePost = async (id:number)=> {
  const res = await axiosInstance.post(`/posts/delete/${id}`)
  console.log(res)
  return res
}

export const updatePost = async  ({id, data}:updatePostInterface)=>{
  console.log(data, id)
  const res = await axiosInstance.put(`/posts/update/${id}`, data)
  console.log(res)
  return res
}

export const createComment = async ( {postId, data}:commentInput)=>{
  const content = data.comment
  console.log(typeof postId)
  const res = await axiosInstance.post('comments/upload', {postId, content})
 
  return res
}

export const fetchComments = async () =>{
  const res = axios.get("http://localhost:5000/api/comments")
  console.log(res)
  return res
}