import React, { useState } from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Check,
  FilePenIcon,
  HeartIcon,
  MessageCircleIcon,
  TrashIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/context/PostContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost, updatePost } from "@/api/query";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

export interface updatePostInterface {
  id: number;
  data: any;
}

interface PostProps {
  id: number;
  content: string;
  username?: string;
  author?: string;
  date: string;
  userId?: number;
  authorId?: number;
}

const Card: React.FC<PostProps> = ({ content, username, author, date, id, userId, authorId }) => {
  const queryClient = useQueryClient();
  const router = useRouter()
  const {  posts, setPosts } = usePosts();
  const { register, handleSubmit } = useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLiked, setIsLiked] =  useState<boolean>(false)
  const {toast} = useToast()

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      console.log('Post deleted successfully');
      // Update the userPosts array in the cache
      queryClient.setQueryData(['users'], (oldData: any) => {
        return {
          ...oldData,
          posts: oldData.posts.filter((post: any) => post.id !== id)
        };
      });
      toast({
        description: 'Post deleted successfully'
      })
    }
  });

  const handleDeletePost = () => {
    deletePostMutation.mutate(id);
  };

  const postEditMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      console.log('Successfully edited');
      queryClient.invalidateQueries({queryKey:['posts']}); 
      router.push('/')
    }
  });

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleUpdatePost = (formData: any) => {
    const data = {
      content: formData.content
    };
    postEditMutation.mutate({ id, data });
    setIsEditing(false);
    const updatedPost = posts?.map((post)=>
    post.id == id ? {...post, content:formData.content} : post
    )
    setPosts(updatedPost)
  };

  const handleEditButton = () => {
    setIsEditing(true);
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <img src="/placeholder.svg" alt="@jaredpalmer" />
          <AvatarFallback>JP</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold">{author}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            @{username}· {date}
          </div>
        </div>
        {userId && authorId && userId === authorId && !isEditing && (
          <div className="flex items-center gap-2 ml-auto">
            <Button onClick={handleEditButton} variant="ghost" size="icon">
              <FilePenIcon className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button onClick={handleDeletePost} variant="ghost" size="icon">
              <TrashIcon className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )}
      </div>

      <div>
        {isEditing ? (
          <div>
            <form onSubmit={handleSubmit(handleUpdatePost)}>
              <Textarea
                {...register("content", {
                  required: true,
                })}
                defaultValue={content}
              />
              <div className="flex justify-end space-x-4 my-2 pb-2">
                <Button>
                  <Check />
                </Button>
                <Button onClick={handleEditCancel} variant="destructive">
                  <X />
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Link href={`posts/${id}`}>
            <p className="line-clamp-3 p-2 text-gray-700">{content}</p>
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <Button
          className={`${isLiked ? "text-red-500 " : ""}`}
          onClick={() => setIsLiked(!isLiked)}
          variant="ghost"
        >
          <HeartIcon
            fill={`${isLiked ? "red" : "white"}`}
            className="w-5 h-5"
          />
        </Button>
        <Link href={`posts/${id}`}>
          <Button variant="ghost">
            <MessageCircleIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
