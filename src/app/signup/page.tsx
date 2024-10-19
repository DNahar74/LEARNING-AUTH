//todo: (1) add validation for all fields
//todo: (2) improve css 

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {toast, Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();

  const [user, setUser] = useState({username: '', email: '', password: ''});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    setLoading(true);
    setButtonDisabled(true);
    try {
      const res = await axios.post("/api/users/signup", user);
      console.log(res.data);
      console.log(res.status);
      toast.success("SignUp successful");
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("SignUp failed :: "+error.response.data.error);
      console.log(error);
      setLoading(false);
      setButtonDisabled(false);
    }
  }

  useEffect(() => {
    if (user.username.length>0 && user.email.length>0 && user.password.length>0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Toaster />
      <form action="post" className='flex flex-col items-center justify-center gap-4 text-black '>
        <h1 className='text-4xl font-bold text-white'>{loading ? "Processing":"SignUp"}</h1>
        
        {/* Username */}
        <label htmlFor="username" className=''></label>
        <input 
        className='px-3 py-1 rounded-sm'
        id='username'
        value={user.username}
        onChange={(e)=>{
          setUser({...user, username: e.target.value});
        }}
        placeholder='username'
        type="text" />

        {/* Email */}
        <label htmlFor="email" className=''></label>
        <input 
        className='px-3 py-1 rounded-sm'
        id='email'
        value={user.email}
        onChange={(e)=>{
          setUser({...user, email: e.target.value});
        }}
        placeholder='email'
        type="email" />

        {/* Password */}
        <label htmlFor="password" className=''></label>
        <input 
        className='px-3 py-1 rounded-sm'
        id='password'
        value={user.password}
        onChange={(e)=>{
          setUser({...user, password: e.target.value});
        }}
        placeholder='password'
        type="password" />

        {/* SignUp Button */}
        <button 
        disabled={buttonDisabled} 
        onClick={onSignUp} 
        className='border-2 rounded-sm border-white mt-4 text-white px-3 py-1'
        >
          SignUp
        </button>

        {/* Go to Login Page */}
        <Link href={'/login'} className='text-white'>Go to login page</Link>
      </form>
    </div>
  )
}

export default SignUpPage