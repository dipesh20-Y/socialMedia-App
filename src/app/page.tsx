'use client'
import Card from "@/components/card/Card";
import Post from "@/components/card/PostBody";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import Link from "next/link";
import Friends from "@/components/card/Friends";
import { useEffect, useState } from "react";
import { useAuth } from "@/middleware/middleware";
import { fetchAllUsers } from "@/api/query";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
   
  const {checkAuth} = useAuth()
   

  useEffect(()=>{
    checkAuth();
  },[])

  return (
    <main className="bg-[#D6D6D6] container mx-auto   py-8 grid md:grid-cols-[250px_1fr_300px] gap-8">
      <div className="bg-gray-100 rounded-lg p-4 h-fit ">
        <nav className="flex flex-col gap-4">
          <Link
            className="hover:underline font-bold  hover:translate-x-1 hover:scale-105 "
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:underline  font-bold hover:translate-x-1 hover:scale-105"
            href="/"
          >
            Explore
          </Link>
          <Link
            className="hover:underline font-bold hover:translate-x-1 hover:scale-105"
            href="/"
          >
            Message
          </Link>
          <Link
            className="hover:underline font-bold  hover:translate-x-1 hover:scale-105"
            href="#"
          >
            Notification
          </Link>
          <Link
            className="hover:underline font-bold  hover:translate-x-1 hover:scale-105"
            href="/profile"
          >
            Profile
          </Link>
        </nav>
      </div>
      {/* //Main body */}
      <div>
        <Post />
        <div className="grid gap-4">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="bg-stone-100 rounded-lg p-4 h-fit">
        <h2 className="text-lg font-bold font-mono mb-4">Friends</h2>
       {/* {users && (
        users.map((user)=>
        <Friends users={users} />
        )
       )} */}
      </div>
    </main>
  );
}
