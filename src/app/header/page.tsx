  'use client'

  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import {  SearchIcon, TwitterIcon } from 'lucide-react'
  import React from 'react'
  import { LogOut } from 'lucide-react'
  import axios from 'axios'
  import {useRouter} from 'next/navigation'
  import { logout } from '@/api/query'
  import { useMutation } from '@tanstack/react-query'
  import { useAuth } from '@/context/AuthContext'
  import Link from 'next/link'

  const Header = () => {
    const router = useRouter()
    const {isAuthenticated, setIsAuthenticated} = useAuth()
    console.log(isAuthenticated)

    

    const logoutMutation = useMutation({
      mutationFn: logout,
      onSuccess: ()=>{
        console.log('logout successful!')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        setIsAuthenticated(false)
        router.push('/login')
        
      }
    })
    const handleLogout = async ()=>{
      logoutMutation.mutate()

      
    }

    return (
      <>
        {!isAuthenticated ? (
          <header className='flex items-start justify-between px-4 py-3 bg-[#1a3b5d] text-white shadow-md'>
          <div className='flex items-center gap-x-2'>
            <TwitterIcon />
            <span className='text-lg font-bold'>Chirp</span>
          </div>
          {/* <div className='flex items-end '>
            
            <div>
            <Link href='/signup'>
            <Button>
                Sign Uo
              </Button></Link>
            </div>
          </div> */}
        </header>
        ): (
          <header className='flex items-start justify-between px-4 py-3 bg-[#1a3b5d] text-white shadow-md'>
          <Link href='/'>
          <div className='flex items-center gap-x-2'>
            <TwitterIcon />
            <span className='text-lg font-bold'>Chirp</span>
          </div></Link>
          <div className='flex items-center gap-4'>
            <div className='relative '>
              <SearchIcon className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 ' />
              <Input type='search' placeholder='Search...' className='pl-8 w-[200px] sm:w-[300px] text-gray-800 font-mono text-sm' />
            </div>
            <div>
              <Button
              onClick={handleLogout}
              variant='destructive'>
              <LogOut />
              </Button>
            </div>
          </div>
        </header>
        )}
      </>
    )
  }

  export default Header
