'use client'
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FiLogOut } from "react-icons/fi";

const AdminHeader = ( ) => {

  const { data } = useSession();
  // console.log("SESSION :::", data);
  const username = data?.user?.username;

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  }

  return (
    <header className='admin-header flex flex-row justify-between items-center'>
      <div>
        <h1 className='text-2xl font-semibold text-dark-100'> {username} | Bookari </h1>
        <p className='text-slate-700 mt-2'> Monitor all of your users and books. </p>
      </div>
      <button
          onClick={handleSignOut}
          className='max-w-lg py-3 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md flex flex-row gap-3 items-center'
      >
        <span> Log Out </span>
        <FiLogOut className='text-white' size={20} />
      </button>
    </header>
  )
}

export default AdminHeader