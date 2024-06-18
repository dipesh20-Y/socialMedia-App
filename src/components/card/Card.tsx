import React, { useEffect, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePost,
  getLikeCount,
  getLikeState,
  toggleLike,
  updatePost,
} from "@/api/query";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import Image from "next/image";

export interface updatePostInterface {
  id: number;
  data: any;
}

interface PostProps {
  id: number;
  content: string;
  username?: string;
  author: string;
  date: string;
  userId?: number;
  authorId?: number;
  imageUrl?: string;
  profilePic?: string;
  likes?: Like[];
}

interface Like {
  likesCount: string;
}

const Card: React.FC<PostProps> = ({
  content,
  username,
  author,
  date,
  id,
  userId,
  authorId,
  imageUrl,
  profilePic,
  // likes
  // adminId,
}) => {
  const [likeCount, setLikeCount] = useState<Like>();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { posts, setPosts } = usePosts();
  const { control, handleSubmit } = useForm();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const { toast } = useToast();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      console.log("Post deleted successfully");
      // Update the userPosts array in the cache
      queryClient.setQueryData(["users"], (oldData: any) => {
        return {
          ...oldData,
          posts: oldData.posts.filter((post: any) => post.id !== id),
        };
      });
      toast({
        description: "Post deleted successfully",
      });
    },
  });

  const handleDeletePost = () => {
    deletePostMutation.mutate(id);
  };

  const { data: likeState, isSuccess: likeStateSuccess } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => getLikeState(id),
  });

  useEffect(() => {
    if (likeStateSuccess) {
      if (likeState) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [likeStateSuccess]);

  const postEditMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      console.log("Successfully edited");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/");
    },
  });

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleUpdatePost = (formData: any) => {
    const data = {
      content: formData.content,
    };
    postEditMutation.mutate({ id, data });
    setIsEditing(false);
    const updatedPost = posts?.map((post) =>
      post.id == id ? { ...post, content: formData.content } : post
    );
    setPosts(updatedPost);
  };

  const handleEditButton = () => {
    setIsEditing(true);
  };

  const { data: likes, isSuccess: likeCountSuccess } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => getLikeCount(id),
  });

  useEffect(() => {
    if (likes && likeCountSuccess) {
      setLikeCount(likes);
    }
  }, [likes, likeCountSuccess]);
  const toggleLikeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const handleLikeClicked = () => {
    toggleLikeMutation.mutate(id);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="relative">
          {profilePic ? (
            <Image src={profilePic} alt={`@${author}`} fill priority={true} />
          ) : (
            <AvatarFallback>{author[0]}</AvatarFallback>
          )}
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
              <Controller
                name="content"
                control={control}
                defaultValue={content}
                rules={{ required: true }}
                render={({ field }) => <Textarea {...field} />}
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
            <div className="shadow-lg translate-x-2 bg-slate-200 rounded-t-lg">
              {imageUrl && (
                <div className="relative w-full max-w-[600px]">
                  <Image
                    src={imageUrl}
                    width={600}
                    height={400}
                    alt={content}
                    layout="responsive"
                    className="rounded-lg overflow-hidden ml-8 shadow-lg p-2"
                  />
                </div>
              )}

              <p className="line-clamp-3 p-8  text-gray-700">{content}</p>
            </div>
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <Button
          onClick={handleLikeClicked}
          variant="ghost"
          className="hover:bg-transparent"
        >
          <div className="flex gap-x-2">
            <HeartIcon
              fill={`${isLiked ? "red" : "white"}`}
              className="w-5 h-5 hover:scale-110 "
            />
            <span>{likeCount?.likesCount}</span>
          </div>
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
