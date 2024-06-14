import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Check, FilePenIcon, TrashIcon, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, updateComment } from "@/api/query";
import { toast } from "../ui/use-toast";
import {Controller, useForm} from 'react-hook-form'
import { commentSchema, comment } from "@/app/posts/[slug]/page";
import { Textarea } from "../ui/textarea";

 interface comments{
  id:number,
  content: string,
  userId?: number,
  date:string,
  author:string,
  username:string,
  commentUserId?:number
}

export interface UpdateCommentInterface{
  id: number,
  data: string
}


const Comment = ({id, content, date, userId, author, username, commentUserId }: comments) => {
  const [isUserValid, setIsUserValid] = useState<boolean>(false)
  const [isEditEnabled, setIsEditEnabled] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const {register, handleSubmit} = useForm()
  // console.log('userId', userId)
  // console.log('userId from comment', commentUserId)

  useEffect(()=>{

  if (userId === commentUserId) {
    setIsUserValid(true)
  }
  },[])

  const deleteCommentMutation = useMutation({
    mutationFn:deleteComment,
    onSuccess:()=>{
      console.log("successfylly deleted")
      toast({
        description:'Comment deleted.'
      })
      queryClient.invalidateQueries({queryKey: ['comments']})
    }
  })

  const handleDeleteComment=()=>{
    deleteCommentMutation.mutate(id)
  }

  const handleEditButton =()=>{
    setIsEditEnabled(true)
  }

  const handleCancleEditComment=()=>{
    setIsEditEnabled(false)
  }

  const editCommentMutation = useMutation({
    mutationFn:updateComment,
    onSuccess:()=>{
      console.log('comment updated successfully')
      toast({
        description: "comment updated successfully"
      })
      queryClient.invalidateQueries({queryKey: ['comments']})
      setIsEditEnabled(false)
    }
  })

  const handleCommentUpdate =(data: any)=>{
    console.log(data)
    editCommentMutation.mutate({id, data})

  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">{author}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-2" >
                @{username} · {date}
              </div>
            </div>
            {isUserValid && (
              <div className="flex items-center gap-2">
              <Button 
              onClick={handleEditButton}
              variant="ghost" size="icon">
                <FilePenIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
              onClick={handleDeleteComment}
              variant="destructive" size="icon">
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
            )}
          </div>
          {isEditEnabled ? (
            <form onSubmit={handleSubmit(handleCommentUpdate)}>
              <Textarea
              {...register('content', {
                required:true,
              })}
              defaultValue={content}
              />
               <div className="flex justify-end space-x-4 my-2 pb-2">
                <Button type="submit">
                  <Check />
                </Button>
                <Button onClick={handleCancleEditComment} variant="destructive">
                  <X />
                </Button>
              </div>
            </form>
          ) : 
          
            <p className="ml-2">{content}</p>
          }
        </div>
      </div>
    </div>
  );
};

export default Comment;
