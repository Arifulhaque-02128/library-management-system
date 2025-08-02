'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Header = () => {

  const { data } = useSession();

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/signin');
  }
  
  return (
    <header className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center space-x-4'>
            <Link href={'/'}>
                <Image src={'/icons/logo.svg'} height={40} width={40} alt='logo' />
            </Link>
            <Link href={'/'}> <h1 className='text-xl font-bold'>Bookari</h1> </Link>
        </div>

        <div className='flex flex-row space-x-4 items-center justify-between'>

            {   (data?.user?.username) ? (
                <div className='relative' ref={modalRef}>
                    <div
                        className='h-12 w-12 rounded-full bg-red-500 flex flex-row justify-center items-center cursor-pointer border-1'
                        onClick={() => setShowModal((prev) => !prev)}
                        
                    >
                        <p className='text-white font-semibold'>{data?.user?.username?.charAt(0)}</p>
                    </div>
                    {showModal && (
                        <div className='bg-white px-4 py-2 absolute right-0 mt-2 rounded-md shadow-lg w-48 flex flex-col gap-2 z-50'>
                            <div className='bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer' 
                            onClick={() => router.push(`/user/${data?.user?.libraryId}`)}
                            >
                                <p className='text-dark-100 text-center'>{data?.user?.username}</p>
                            </div>
                            
                            <button
                                onClick={handleSignOut}
                                className='w-full py-2 px-4 bg-gray-50 hover:bg-red-600 text-dark-100 hover:text-white rounded mt-2 '
                            >
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>)

                :

                <Link
                    href={'/signin'}
                    className='w-full py-2 px-4 bg-dark-600 hover:bg-dark-700 text-white rounded'
                >
                    Sign In
                </Link>
            }

        </div>
        
    </header>
  )
}

export default Header