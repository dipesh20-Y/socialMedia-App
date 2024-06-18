'use client'

import { usePosts } from "@/context/PostContext"
import { useState, useEffect } from "react";


export const FilterPosts = (data:any)=>{

    const {posts} =usePosts()
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    if (data && posts && Array.isArray(posts)) {
      const filtered = posts?.filter((post) => post.userId === data.id);
      setUserPosts(filtered);
    }
  }, [data, posts]);

}