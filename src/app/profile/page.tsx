"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import Card from "@/components/card/Card";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthor } from "@/api/query";
import { usePosts } from "@/context/PostContext";
import moment from "moment";

const Profile = () => {
  const { posts } = usePosts();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAuthor,
  });

  useEffect(() => {
    if (data && posts && Array.isArray(posts)) {
      const filtered = posts?.filter((post) => post.userId === data.id);
      setUserPosts(filtered);
    }
  }, [data, posts]);

  if (isSuccess) {
    console.log(data);
    console.log(posts);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{`error occurred: ${error}`}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl">
        <div className="relative h-40 md:h-52 overflow-hidden rounded-t-xl">
          <img
            height={320}
            width={1200}
            src="/dipesh.jpeg"
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-6 md:px-8 py-6 md:py-8">
          <div className="flex items-center">
            <div className="relative -mt-16 md:-mt-20">
              <img
                width={80}
                height={80}
                src="/dipesh.jpg"
                alt="profile"
                className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-white"
              />
            </div>
            <div className="ml-4 md:ml-6 flex-1">
              <h2 className="text-lg font-bold md:text-2xl">{data?.author}</h2>
              <p className="text-gray-500 text-sm md:text-base">
                @{data?.username}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {userPosts &&
              userPosts.map((post) => (
                <Card
                  key={post.id}
                  id={post.id}
                  content={post.content}
                  date={moment(post.updatedAt).fromNow()}
                  author={data.author}
                  username={data.username}
                  userId={post.userId}
                  authorId={data.id}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
