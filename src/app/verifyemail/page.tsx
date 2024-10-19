//todo: (1) remove the 2 token not found toasts when the user enters the page
//todo:     this is happening because of the useEffects, onloading don't have the token.
//todo: (2) implement the second, better approach to get token from the url
//todo: (3) improve css 
//todo: (4) handle error states (state variable)

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast, Toaster} from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// import { Router, useRouter } from 'next/router';   //? To be imported if the other approach is used

const VerifyEmailPage = () => {
  const router = useRouter();

  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyEmail = async () => {
    try {
      await axios.post('/api/users/verifyemail', {token});
      setVerified(true);
      setError(false);
      router.push("/login");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(true);
      toast.error("Verification failed :: "+error.response.data.error);
    }
  }

  useEffect( () => {
    setError(false);
    const token = window.location.search.split('=')[1];

    //? This is the better approach :-
    //? const {query} = router;
    //? const token = query.token;

    if(token){
      setToken(token);
      setError(false);
    } else {
      toast.error("No token found");
      setError(true);
    }
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <Toaster />
      <h1 className='text-4xl font-bold text-white'> 
        Verify Email
      </h1>
      <h2 className='p-2 bg-orange-500 text-black'>
        {token ? `${token}`: 'no token'}
      </h2>
      {verified && (
        <div>
          <h2 className='text-center'>Verified</h2>
          <p className='text-center'>Redirecting to Login...</p>
        </div>
      )}
      {error && (
        <div>
          <h2 className='text-center'>Error</h2>
        </div>
      )}
      <button 
      type="submit"
      disabled={!token && error}
      onClick={verifyEmail}
      className='border-2 rounded-sm border-white mt-4 text-white px-3 py-1'
      >
        Verify Email
      </button>
    </div>
  )
}

export default VerifyEmailPage