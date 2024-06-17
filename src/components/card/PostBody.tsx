"use client";

import React, { ChangeEvent, useState , useRef} from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePosts } from "@/context/PostContext";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

const postSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.any().optional(),
});

export interface post {
  content: string;
  image: File;
}

const Post = () => {
  const { fetchAllPosts } = usePosts();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { handleSubmit, control, setValue, watch, reset } = useForm({
    resolver: zodResolver(postSchema),
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const postUploadMutation = useMutation({
    mutationFn: async ({ content, image }: post) => {
      const formData = new FormData();
      formData.append("file", image);

      const urlResponse = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = urlResponse.data;
      console.log(imageUrl);

      const postResponse = await axiosInstance.post("/posts/upload", {
        content: content,
        imageUrl: imageUrl,
      });
      return postResponse.data;
    },
    onSuccess: () => {
      console.log("post upload successful!");
      toast({
        description: "Post created successfully",
      });
      fetchAllPosts();
      reset({ content: ""});
      if(fileInputRef.current){
        fileInputRef.current.value=""
      }
      setImagePreview(null)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    const { content, image } = data;
    postUploadMutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file);
    }
  };

  const selectedImage = watch("image");

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
          <Avatar className="block">
            <img src="/dipesh.jpeg" alt="@dipesh" />
            <AvatarFallback> D</AvatarFallback>
          </Avatar>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="What's happening?"
                className="flex-1 bg-transparent border focus:ring-o"
              />
            )}
          />

          <Button
            variant="ghost"
            type="button"
            size="icon"
            onClick={() => {
              const imageInput = document.getElementById("imageInput");
              if (imageInput) {
                imageInput.click();
              }
            }}
          >
            <ImageIcon className="h-4 w-4" />
            <span className="sr-only">Add image</span>
          </Button>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </div>
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Selected"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
        <div className="flex items-center justify-end mt-4 ">
          <Button type="submit" className="bg-[#1a3c5b]">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Post;
