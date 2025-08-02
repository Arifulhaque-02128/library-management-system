import Header from '@/components/Header/Header'
import React, { ReactNode } from 'react'

import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });

const Layout = ({children} : {children : ReactNode}) => {
  return (
    <main className={`root-container ${poppins.className}`}>
        <div className='mx-auto max-w-screen-2xl text-white py-12 px-4 w-full'>
            <Header />

            <div className='mt-20 mb-20'> {children} </div>
        </div>
    </main>
  )
}

export default Layout