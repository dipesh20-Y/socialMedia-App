"use client";
import React, { useState } from "react";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useMedia } from "@/context/context";
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
import { useRouter } from "next/navigation";
import { EyeOff, Eye } from "lucide-react";
import { loginPost } from "@/api/query";
import { useMutation } from "@tanstack/react-query";
import FormFieldComponent from "@/components/form/formField";

const loginSchema = z.object({
  userName: z.string(),
  password: z.string().min(6),
});

export interface login {
  userName: string;
  password: string;
}

const LoginPage = () => {
  // const { tokens, setTokens } = useMedia();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const LoginMutation = useMutation({
    mutationFn: loginPost,
    onSuccess: (res) => {
      console.log(res);
      if (res.status === 200) {
        const { accessToken, refreshToken, role } = res.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("role", role);
        

        // sessionData && setTokens(sessionData);
        router.push("/");
      }

      console.log("login successful");
    },
    onError: (error) => {
      console.log("error occured:", error);
    },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    const { userName, password } = values;
    LoginMutation.mutate({ userName, password });
  };

  const togglePassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-[#ffafbd] to-[#ffc3a0]">
      {/* <div className="container mx-auto h-screen max-w-5xl"> */}
      <div className="flex justify-center items-center  pl-8 py-8">
        <div className="flex flex-col mt-24  max-w-lg w-full border shadow-2xl border-gray-400  pt-8 bg-[#F4F4F4] rounded-2xl">
          <div className="text-center mb-8 ">
            <h1 className="text-3xl text-center font-bold">Welcome back </h1>
            <span>Please enter your information to sign in</span>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className=" max-w-lg w-full px-8  "
            >
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

              <div>
                <Button
                  type="submit"
                  className="w-full my-8 bg-blue-500 mt-8  "
                >
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
          <div>
            <p className="text-sm text-center mb-8">
              `Don&apos;s have an account?`
              <span
                onClick={() => {
                  router.push("/signup");
                }}
                className="hover:underline text-indigo-700 hover:font-bold"
              >
                {" "}
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default LoginPage;
