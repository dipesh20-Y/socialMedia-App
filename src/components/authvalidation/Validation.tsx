'use client'

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const ValidateUser = ()=>{
    const router = useRouter()
  const {isAuthenticated} = useAuth()

  useEffect(() => {
    console.log(isAuthenticated)
    if (isAuthenticated != undefined && !isAuthenticated) {
      router.push("login");
    }
  }, [isAuthenticated, router]);

  return null

}
