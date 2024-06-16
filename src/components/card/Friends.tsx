import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'


const Friends = (user:any) => {

 
  return (
    <div className="grid my-4 hover:bg-white hover:rounded-lg hover:translate-x-1   ">
    <div className="flex gap-2">
      <Avatar className='block'>
        <img src="/dipesh.jpeg" alt="@username" />
        <AvatarFallback>J</AvatarFallback>
      </Avatar>
      <div>
      <div className="text-md">{user.user. author} </div>
        <div className="text-sm text-gray-500">@{user.user.username}</div>
      
      </div>
    </div>
  </div>
  )
}

export default Friends
