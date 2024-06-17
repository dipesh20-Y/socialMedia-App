
"use client"

import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import * as z from 'zod'
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "../ui/form"
import Image from "next/image"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/api/axiosInstance"
import axios from "axios"
import { useToast } from "../ui/use-toast"

interface UserProfile {
  username: string;
  author: string;
  image?: File;
}

const userSchema = z.object({
  username: z.string().min(4, "Username must be of at least 4 letters"),
  author: z.string().min(1, "Name of user is required"),
  image: z.any().optional(),
});

export default function EditProfile({author, username, image}: UserProfile) {
  const {toast} = useToast()
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema)
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", file);
    }
  };

  const userUpdateMutation = useMutation({
    mutationFn: async({username, author, image}:UserProfile)=>{
      const formData= new FormData()
      image && formData.append('file', image)

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
      console.log(imageUrl)
      

      const updateResponse = await axiosInstance.put('users/update', {
        username: username,
        author: author,
        profilePicUrl: imageUrl
      })
      return updateResponse.data;
    },
    onSuccess:()=>{
      console.log('user updated successfully')
      toast({
        description:"User updated successfully"
      })
      queryClient.invalidateQueries({queryKey:['user']})
    }
  })


  const handleProfileUpdate = (data:any)=>{
      console.log(data)
    userUpdateMutation.mutate(data)
  }

    const selectedImage = form.watch('image')
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileUpdate)}>
        <div className="grid gap-4 py-4">
          <div className="grid  items-center gap-4">
          <Controller
          name='author'
          control={form.control}
          defaultValue={author}
          render={({field})=>(
            <FormItem>
          <FormLabel className="text-right">Name</FormLabel>
          <FormControl>
            <Input placeholder="Name..."  {...field}  />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
          />
          </div>
          <div className="grid  items-center gap-4">
            <Controller
          name='username'
          control={form.control}
          defaultValue={username}
          render={({field})=>(
            <FormItem>
          <FormLabel className="text-right">Username</FormLabel>
          <FormControl>
            <Input placeholder="username..."  {...field} className="col-span-3" />
          </FormControl>
          <FormMessage />
        </FormItem>
          )}
          />
          </div>
          <div>
            <Label htmlFor="image" className="text-right">
              Profile Picture
            </Label>
            <div className="flex flex-col items-center mt-4">
              <input
                id="image"
                type="file"
                accept="image/*"
                className="file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                onChange={(e)=>handleImageChange(e)}
              />
               {imagePreview && (
          <div className="mt-8">
            <img
              src={imagePreview}
              alt="Selected"
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
        </Form>
        
      </DialogContent>
    </Dialog>
  )
}