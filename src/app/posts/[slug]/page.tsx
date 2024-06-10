'use client'
import Card from "@/components/card/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Comment from "@/components/card/Comment";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "@/api/query";
import moment from "moment";
import { usePosts } from "@/context/PostContext";



const PostDetail = ({params}: {params:{slug:string}}) => {
  const router = useRouter()
  const{isLiked, setIsLiked} = usePosts()
  console.log(params.slug)
  
  const{data, isLoading, isSuccess, error}= useQuery({
    queryKey:['posts'],
    queryFn: ()=> fetchPostById(params.slug)
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if(isSuccess){
    console.log(data)
  }

  if(error){
    return <div>{`Error occured: ${error}`}</div>
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div>
        <div className="bg-gray-100 dark:bg-[#1a3b5d] rounded-lg p-4 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="block">
              <img src="/placeholder.svg" alt="@jaredpalmer" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold">{data?.user?.author}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                @{data?.user?.username} · {moment(data?.createdAt).fromNow()}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <p>
             {data?.content}
            </p>
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="icon"
                  className={`${isLiked ? "text-red-500" : ""}`}
                  onClick={() => setIsLiked(!isLiked)}
              >
                <HeartIcon className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
            </div>
          </div>
          <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <img src="/placeholder.svg" alt="@jaredpalmer" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold mb-2">Comments</h3>
                  <Input
                    placeholder="Write a comment..."
                    className="bg-transparent border-none focus:ring-0 dark:text-gray-200"
                  />
                </div>
              </div>
            <div className="grid gap-4">
            <Comment />
            <Comment />
            <Comment />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};



export default PostDetail;
