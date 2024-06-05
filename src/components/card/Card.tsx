import React from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { HeartIcon, MessageCircleIcon } from "lucide-react";

const Card = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <div className="flex items-center mb-4 gap-4">
        <Avatar className="block">
          <img src="/dipesh.jpeg" alt="@username" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-bold font-mono">John Doe</div>
          <div className="text-gray-500 text-sm"> @username | 2024</div>
        </div>
      </div>

      <div className="shadow-lg">
        <img
          src="/landscape.jpg"
          width={600}
          height={4000}
          alt="Post image"
          className=" rounded-lg mb-4 w-full  "
        />
        <p className="line-clamp-3 p-2  text-gray-700  ">
          This is a sample post on the Chirp social media app. Users can create
          and share posts with their followers.
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
                <Button variant="ghost">
                  <HeartIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost">
                  <MessageCircleIcon className="h-5 w-5" />
                </Button>
              </div>
    </div>
  );
};

export default Card;
