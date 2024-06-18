"use client";
import Card from "@/components/card/Card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Comment from "@/components/card/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  fetchAuthor,
  fetchComments,
  fetchPostById,
  getLikeState,
  toggleLike,
} from "@/api/query";
import moment from "moment";
import { usePosts } from "@/context/PostContext";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

export const commentSchema = z.object({
  comment: z.string().min(1, "comment is required"),
});

export interface comment {
  comment: string;
}

const PostDetail = ({ params }: { params: { slug: string } }) => {
  // const router = useRouter()
  const [likeCount, setLikeCount] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const postId = parseInt(params.slug, 10);
  console.log(typeof postId);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  console.log(params.slug);
  const { reset, handleSubmit, control } = useForm<comment>({
    resolver: zodResolver(commentSchema),
  });
  const { toast } = useToast();
  const [receivedComment, setReceivedComment] = useState<any>([]);

  const { data: admin } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAuthor,
  });

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["post", params.slug],
    queryFn: () => fetchPostById(params.slug),
  });
  if (isSuccess) {
    console.log(data);
  }

  const { data: likeState, isSuccess: likeStateSuccess } = useQuery({
    queryKey: ["likes", postId],
    queryFn: () => getLikeState(postId),
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

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLike,
    onSuccess: (data) => {
      setLikeCount(data.likesCount);
      console.log("success and count:", data.likesCount);
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });

  const handleLikeClicked = () => {
    toggleLikeMutation.mutate(postId);

    setIsLiked(!isLiked);
  };

  const {
    data: comments,
    error: commentError,
    isLoading: commentsLoading,
    isSuccess: commentSuccess,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  useEffect(() => {
    if (comments && commentSuccess) {
      const filtered = comments.filter(
        (comment: any) => comment.postId == postId
      );

      setReceivedComment(filtered);
    }
  }, [comments, commentSuccess]);

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast({
        description: "comment added successfully",
      });
      console.log("comment added successfully");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      reset({ comment: "" });
    },
  });

  const handleCommentSubmit = (data: comment) => {
    createCommentMutation.mutate({ postId, data });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isSuccess) {
    console.log(data);
  }

  if (error) {
    return <div>{`Error occured: ${error}`}</div>;
  }

  return (
    <main className="container mx-auto py-8 px-4 ">
      <div>
        <div className="bg-gray-200  rounded-lg p-4 flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="block">
              <AvatarFallback>{data?.user?.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold">{data?.user?.author}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                @{data?.user?.username} · {moment(data?.createdAt).fromNow()}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {data.imageUrl && (
              <div className="relative w-full max-w-[600px]">
                <Image
                  src={data.imageUrl}
                  width={600}
                  height={400}
                  alt={data.content}
                  className="rounded-lg overflow-hidden ml-8 "
                />
              </div>
            )}
            <p className="text-gray-600 p-8">{data?.content}</p>
            <div className="flex items-center justify-between ">
              <Button
                variant="ghost"
                size="icon"
                className={`${isLiked ? "text-red-500" : ""}`}
                onClick={handleLikeClicked}
              >
                <div className="flex gap-x-2">
                  <HeartIcon
                    fill={`${isLiked ? "red" : "white"}`}
                    className="w-5 h-5"
                  />
                  <span>{likeCount}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg p-4 mt-8">
          <div className="mt-4 border-t pt-4">
            <form onSubmit={handleSubmit(handleCommentSubmit)}>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="relative">
                  {admin?.profilePicUrl ? (
                    <Image
                      src={admin?.profilePicUrl}
                      alt={`@${admin?.username}`}
                      fill
                      priority={true}
                    />
                  ) : (
                    <AvatarFallback>{admin?.username[0]}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold mb-8 text-2xl">Comments</h3>
                  <div className="flex gap-x-4">
                    <Controller
                      name="comment"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Write a comment..."
                          className="bg-white border focus:ring-0 dark:text-gray-200  "
                        />
                      )}
                    />
                    <Button className="bg-[#1a3b5d]"> Add</Button>
                  </div>
                </div>
              </div>
            </form>
            <div className="grid gap-4 ">
              {receivedComment &&
                receivedComment.map((comment: any) => (
                  <Comment
                    content={comment.content}
                    id={comment.id}
                    key={comment.id}
                    date={moment(comment.createdAt).fromNow()}
                    userId={admin.id}
                    author={comment.user.author}
                    username={comment.user.username}
                    commentUserId={comment.userId}
                    image={comment?.user.profilePicUrl}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostDetail;
