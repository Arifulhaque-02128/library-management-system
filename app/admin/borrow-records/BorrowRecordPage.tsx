'use client'
import BorrowedBooks from '@/components/AdminComponents/BorrowedBooks/BorrowedBooks';
import { useGetAllBorrowedBooksQuery } from '@/lib/Redux/features/handleApi';
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const BorrowRecordPage = () => {

  const { data : books, isLoading, isError } = useGetAllBorrowedBooksQuery(`/api/borrowBook/`, {
    refetchOnMountOrArgChange : true
  });
  console.log("Borrow Books :::", books);

  useEffect(() => {
    if(isError) {
        toast.error("Failed to fetch Books.")
    }
  }, [isError])

  return (
    <section className='w-full bg-white p-7 rounded-xl'>
        <Toaster />

        <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-xl font-semibold'>Borrow Book Request</h1>
        </div>

        {/* Books Table */}
        <div className='w-full mt-7 min-h-[300px]'>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
            </div>
          ) : ( !isError &&
            <BorrowedBooks borrowedBooks = {books.data} />
          )
        }
      </div>
    </section>
  )
}

export default BorrowRecordPage