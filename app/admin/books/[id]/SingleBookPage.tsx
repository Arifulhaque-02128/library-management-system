'use client'
// @ts-ignore
import SingleBook from '@/components/AdminComponents/SingleBook';
import { Button } from '@/components/ui/button';
import { useGetBookByIdQuery } from '@/lib/Redux/features/handleApi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react'


const SingleBookPage = ( ) => {

  const { id } = useParams();

  const { data : book, isLoading, isError } = useGetBookByIdQuery(`/api/books/${id}`);

//   console.log("Book :::", book?.data);

  return (
    <div> 
        <Link href={'/admin/books'}>
            <Button className='back-btn'>
                Go Back
            </Button>
        </Link>

        {/* Single Boook */}
        <div className='w-full mt-7 min-h-[300px]'>
        {
            isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
                </div>
            ) : ( !isError &&
                <SingleBook bookData={book?.data} UI='ADMIN'/>
            )
        }
        </div>
    </div>
  )
}

export default SingleBookPage