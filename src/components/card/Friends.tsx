import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import Image from "next/image";

interface Friend{
  id:number
  author:string
  username:string,
  image?:string
}

const Friends = ({author, username, image, id} : Friend) => {
  if (id==4) {
    console.log(image)
  }
  return (
    <Link href={`friends/${id}`}>
      <div className="grid my-4 hover:bg-white hover:rounded-lg hover:translate-x-1   ">
        <div className="flex gap-2">
          <Avatar className="relative">
            {image ? (
            <Image src={image} alt={`@${username}`} fill priority={true} />

            ) : (
            <AvatarFallback>{author[0]}</AvatarFallback>

            )}
          </Avatar>
          <div>
            <div className="text-md">{author} </div>
            <div className="text-sm text-gray-500">@{username}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Friends;
