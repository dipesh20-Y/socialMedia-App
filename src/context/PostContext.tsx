'use client'

import axios from "axios";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Shape of context
interface PostContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isLiked: boolean;
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllPosts: () => void; // Add fetchAllPosts to the context
}

interface Post {
  imageUrl: string | undefined;
  likes: Like;
  id: number;
  content: string;
  updatedAt: Date;
  userId: number;
  user: User;
  // comment: Comment;
}

interface User {
  id: number;
  username: string;
  author: string;
}

interface Comment{
  id:number;
  content:string
  updatedAt: Date
  userId:number
  postId: number
}

const PostsContext = createContext<PostContextType | undefined>(undefined);

export const usePosts = () => {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error('usePosts must be used within a postProvider');
  }
  return context;
}

interface PostsProviderProps {
  children: ReactNode;
}

// Fetch function for React Query
const fetchPosts = async () => {
  const response = await axios.get('http://localhost:5000/api/posts');
  return response.data;
};

// Create provider component
export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);

//   const queryClient = useQueryClient();

  // Use React Query to fetch posts
  const { data, refetch: fetchAllPosts, isSuccess } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    
  });

  // Ensure posts are updated if React Query fetches them
  useEffect(() => {
    if (data && isSuccess) {
      setPosts(data);
    }
  }, [data, isSuccess]);

  return (
    <PostsContext.Provider value={{ posts, setPosts, isLiked, setIsLiked, fetchAllPosts }}>
      {children}
    </PostsContext.Provider>
  );
}
