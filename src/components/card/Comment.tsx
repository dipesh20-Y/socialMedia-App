import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { FilePenIcon, TrashIcon } from "lucide-react";

const Comment = () => {
  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar>
          <img src="/placeholder.svg" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Colm Tuite</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                @shadcn · 2h
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <FilePenIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button variant="ghost" size="icon">
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
          <p>Great post! I'm excited to see more from the Chirp community.</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
