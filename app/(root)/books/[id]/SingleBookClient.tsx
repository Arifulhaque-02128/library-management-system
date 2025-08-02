'use client'

import BookOverview from '@/components/BookOverview/BookOverview';
import { Button } from '@/components/ui/button';
import { useGetBookByIdQuery } from '@/lib/Redux/features/handleApi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

const SingleBookClient = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useGetBookByIdQuery(`/api/books/${id}`);

  return (
    <div>
      <Link href={'/'}>
        <Button className='bg-dark-600 hover:bg-dark-700 text-light-100'>
          Go Back
        </Button>
      </Link>

      <div className='w-full mt-12 min-h-[300px]'>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
          </div>
        ) : (!isError && (
          <section>
            <BookOverview {...book?.data} pageRoute="BOOK" />
            <div className='mt-12 space-y-4 max-w-6xl text-justify'>
              <h1 className={"font-bold text-xl text-light-300"}>Description</h1>
              <p className='text-gray-500'> {book?.data?.description} </p>
            </div>

            <div className='mt-12 space-y-4 max-w-6xl text-justify'>
              <h1 className={"font-bold text-xl text-light-300"}>Summary</h1>
              <p className='text-gray-500'> {book?.data?.summary} </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SingleBookClient;