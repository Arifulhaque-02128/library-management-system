import Image from 'next/image'
import React, { ReactNode } from 'react'

const layout = ({ children } : { children : ReactNode }) => {
  return (
    <main className='auth-container'>
        <section className='auth-form'>
            <div className='auth-box'>
                <div className='flex flex-row gap-3'>
                    <Image src={'/icons/logo.svg'} height={40} width={40} alt='logo'/>
                    <h1 className='text-xl font-semibold'> Bookari </h1>
                </div>
                
                <div>
                    {children}
                </div>
            </div>
        </section>

        <section className='auth-illustration'>
            <Image src={'/images/auth-illustration.png'} width={1000} height={200} alt='Auth Illustration' className='size-full object-cover' />
        </section>
    </main>
  )
}

export default layout