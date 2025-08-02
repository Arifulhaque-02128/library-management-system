'use client'
import AllBooks from '@/components/AdminComponents/AllBooks/AllBooks'
import { useGetBooksQuery } from '@/lib/Redux/features/handleApi'
import { setBooks } from '@/lib/Redux/features/handleBooks'
import Link from 'next/link'
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'

const BookPage = () => {
//   const {data} = await getAllBooks();
  const { data: books, isError, isLoading } = useGetBooksQuery('/api/books', {
    refetchOnMountOrArgChange: true
  });
  const allBooks = books?.data
//   console.log("ALL BOOKS :::", allBooks);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBooks(allBooks));
  }, [allBooks]);

  if(isError){
    toast.error("Failed to fetch books");
  }

  return (
    <section className='w-full bg-white p-7 rounded-xl'>
        <Toaster />

        <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-xl font-semibold'>All Books</h1>
            <Link href={'/admin/books/new'}>
                <button className='bg-primary-admin text-white md:px-4 md:py-2 p-2 rounded-md'>
                    + Create a New Book
                </button>
            </Link>
        </div>

        {/* Books Table */}
        <div className='w-full mt-7 min-h-[300px]'>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
            </div>
          ) : ( !isError &&
            <AllBooks />
          )
        }
      </div>
    </section>
  )
}

export default BookPage