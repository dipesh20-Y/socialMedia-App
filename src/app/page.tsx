"use client";
import Card from "@/components/card/Card";
import Post from "@/components/card/PostBody";
import Link from "next/link";
import Friends from "@/components/card/Friends";
import { useEffect, useState } from "react";
import {  fetchAllUsers, fetchAuthor } from "@/api/query";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePosts } from "@/context/PostContext";
import moment from 'moment'

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { posts } = usePosts();

  console.log(posts)
  
  //sorting posts in descending order
  const sortedPosts = Array.isArray(posts) ? posts?.sort((a,b) => new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime()) :[]

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const {data:admin} = useQuery({
    queryKey:['users'],
    queryFn:fetchAuthor
  })


  

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated != undefined && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (isSuccess) {
    console.log(data);
  }

  
  const usersArray = Array.isArray(data) ? data : [];

  return (
    <main className="bg-[#D6D6D6] container mx-auto py-8 grid md:grid-cols-[250px_1fr_300px] gap-8">
      <div className="bg-gray-100 rounded-lg p-4 h-fit ">
        <nav className="flex flex-col gap-4">
          <Link
            className="hover:underline font-bold  hover:translate-x-1 hover:scale-105"
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:underline font-bold hover:translate-x-1 hover:scale-105"
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
          {sortedPosts &&
            sortedPosts.map((post) => (
              <Card
                key={post.id}
                id={post.id}
                content={post.content}
                date={moment(post.updatedAt).fromNow()}
                author={post.user.author}
                username={post.user.username}
                imageUrl={post.imageUrl}
                // likes={post.likes}
                // adminId={admin.id}
              />
            ))}
        </div>
      </div>
      <div className="bg-stone-100 rounded-lg p-4 h-fit">
        <h2 className="text-lg font-bold font-mono mb-4">Friends</h2>
        {usersArray?.map((user: any) => (
          <Friends key={user.id} id={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
