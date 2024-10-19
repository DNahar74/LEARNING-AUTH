//todo: (1) remove the username error, by defining an interface
//todo: (2) improve css 
//todo: (3) make the UI display the user details

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {toast, Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const res = await axios.get('/api/users/aboutme');
      console.log(res.data);
      setUser(res.data.user);
    } catch (error) {
      toast.error("Couldn't get user information");
      console.error(error);
    }
  }

  const logout = async () => {
    try {
      await axios.get('/api/users/logout');
      setUser(null);
      toast.success('Logged Out');
      router.push('/');
    } catch (error) {
      toast.error("Couldn't get user information");
      console.error(error);
    }
  }
  
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Toaster />
      <h1 className='text-4xl font-bold text-white'> 
        Profile
      </h1>

      <h2 className='text-4xl font-bold text-blue-400'> 
        {/* there is an error because, we have not defined an interface for user */}
        {user===null ? "no data found" : user.username} 
      </h2>

      <button 
      type="submit"
      className='border-2 rounded-sm border-white mt-4 bg-red-400 text-black px-3 py-1'
      onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

export default Profile