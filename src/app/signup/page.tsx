"use client";
import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { postAuth } from "@/api/query";
import FormFieldComponent from "@/components/form/formField";
import { useToast } from "@/components/ui/use-toast";

export interface signup {
  author: string;
  email: string;
  userName: string;
  password: string;
}

const signupSchema = z
  .object({
    author: z.string(),
    email: z.string().email(),
    userName: z
      .string()
      .min(4, { message: "username must be of atleast 4 character" }),
    password: z
      .string()
      .min(6, { message: "password must be of atleast 6 character" }),
    passwordConfirm: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Password don't match",
      path: ["passwordConfirm"],
    }
  );

const SignupPage = () => {
  const {toast} = useToast()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      author: "",
      email: "",
      userName: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: postAuth,
    onSuccess: (data) => {
      console.log("account created successfully!!");
      router.push("/login");
      toast({
        description:'Signup successful'
      })
      console.log(data);
    },
    onError: (error) => {
      console.log("error occured:", error);
    },
  });

  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    const { author, email, userName, password } = values;
    // console.log(email)
    signupMutation.mutate({ author, email, userName, password });
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPassword = () => {
    setIsConfirmVisible(!isConfirmVisible);
  };

  return (
    <main className="h-screen w-full ">
      <div className="min-h-screen w-full bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0]">
        <div className=" mx-auto  max-w-5xl">
          <div className="flex justify-center items-center  pl-8 py-8">
            <div className="flex flex-col mt-24  max-w-lg w-full border shadow-2xl border-gray-400  pt-8 bg-[#F4F4F4] rounded-2xl">
              <div className="text-center mb-8 ">
                <h1 className="text-3xl text-center font-bold">Welcome </h1>
                <span>Please enter your information to sign in</span>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSignup)}
                  className=" max-w-lg w-full px-8  "
                >
                  <div className="mt-4">
                    <FormFieldComponent
                      name="author"
                      control={form.control}
                      label="Full Name"
                      placeholder="Enter your name..."
                      type="text"
                    />
                  </div>
                  <div className="mt-4">
                    <FormFieldComponent
                      name="email"
                      control={form.control}
                      label="Email Address"
                      placeholder="Enter your email..."
                      type="text"
                    />
                  </div>
                  <div className="mt-4">
                    <FormFieldComponent
                      name="userName"
                      control={form.control}
                      label="Username"
                      placeholder="Enter your username..."
                      type="text"
                    />
                  </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Input
                                  className="font-mono"
                                  placeholder="********"
                                  type={isPasswordVisible ? "text" : "password"}
                                  {...field}
                                />
                                <div className="-ml-10 mt-2 ">
                                  {!isPasswordVisible ? (
                                    <EyeOff
                                      className="cursor-pointer"
                                      onClick={togglePassword}
                                    />
                                  ) : (
                                    <Eye
                                      className="cursor-pointer"
                                      onClick={togglePassword}
                                    />
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="passwordConfirm"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="flex">
                                <Input
                                  className="font-mono"
                                  placeholder="********"
                                  type={isConfirmVisible ? "text" : "password"}
                                  {...field}
                                />
                                <div className="-ml-10 mt-2 ">
                                  {!isConfirmVisible ? (
                                    <EyeOff
                                      className="cursor-pointer"
                                      onClick={toggleConfirmPassword}
                                    />
                                  ) : (
                                    <Eye
                                      className="cursor-pointer"
                                      onClick={toggleConfirmPassword}
                                    />
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="w-full my-8 bg-[#1a3b5d] mt-8  "
                    >
                      Sign up
                    </Button>
                  </div>
                </form>
              </Form>
              <div>
                <p className="text-sm text-center mb-8">
                  Already have an account?
                  <span
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="hover:underline text-indigo-700 hover:font-bold"
                  >
                    {" "}
                    Sign in
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
