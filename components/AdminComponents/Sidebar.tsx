'use client'
import { adminSideBarLinks } from '@/constants/data'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Sidebar = () => {

  const selectedRoute = usePathname();

  const {data} = useSession();

  return (
    <div className='admin-sidebar'>

        <div>

            <Link className='logo' href={'/'}>
                <Image src={'/icons/admin/logo.svg'} width={35} height={35} alt='logo' />
                <h1>Bookari</h1>
            </Link>

                {
                    adminSideBarLinks?.map((item) => {
                        const exact = selectedRoute === item.route[0];
                        const startsWithNested = selectedRoute.startsWith(item.route[0] + '/') && item.route[0] !== '/admin';
                        const isActive = exact || startsWithNested;
                        return (
                            <Link href={`${item.route[0]}`} key={item.route[0]}>
                                <div className={cn('link m-2', isActive && "bg-primary-admin shadow-sm")}>
                                    <div className="relative size-5">
                                        <Image src={item.img} fill alt='' className={cn('object-contain', isActive && 'brightness-0 invert')} />
                                    </div>
                                    <p className={cn('text-dark-100', isActive && 'text-white')}> {item.text} </p>
                                </div>
                            </Link>
                        )
                    })
                }

        </div>

        <div className='user'>
            <div
                className='h-12 w-12 rounded-full bg-light-200 flex flex-row justify-center items-center cursor-pointer border-1'
                
            >
                <p className='text-dark-100 font-semibold'>{data?.user?.username?.charAt(0)}</p>
            </div>
            <div className='flex flex-col max-md:hidden'>
                <p className='text-dark-100 font-medium'> {data?.user?.username} </p>
                <p className='text-dark-600'> {data?.user?.email} </p>
            </div>
        </div>

    </div>
  )
}

export default Sidebar