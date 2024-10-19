//todo: (1) add validation for all fields
//todo: (2) improve css 
//todo: (3) check for delays between toast and redirection 

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {toast, Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();

  const [user, setUser] = useState({email: '', password: ''});
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    setButtonDisabled(true);
    try {
      const res = await axios.post("/api/users/login", user);
      console.log(res.data);
      console.log(res.status);
      toast.success("Login successful");
      router.push("/profile");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error("Login failed :: "+error.response.data.error);
      console.log(error);
      setLoading(false);
      setButtonDisabled(false);
    }
  }

  useEffect(() => {
    if (user.email.length>0 && user.password.length>0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Toaster />
      <form action="post" className='flex flex-col items-center justify-center gap-4 text-black '>
        <h1 className='text-4xl font-bold text-white'>{loading ? "Processing":"Login"}</h1>

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

        {/* Login Button */}
        <button 
        disabled={buttonDisabled} 
        onClick={onLogin} 
        className='border-2 rounded-sm border-white mt-4 text-white px-3 py-1'
        >
          Login
        </button>

        {/* Go to Login Page */}
        <Link href={'/signup'} className='text-white'>Go to signup page</Link>
      </form>
    </div>
  )
}

export default LoginPage