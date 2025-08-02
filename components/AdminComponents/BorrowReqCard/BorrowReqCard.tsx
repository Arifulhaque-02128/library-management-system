'use client'
import { useGetAllBorrowedBooksQuery } from '@/lib/Redux/features/handleApi';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { SlCalender } from "react-icons/sl";

const BorrowReqCard = () => {

  const { data : books, isLoading, isSuccess, isError } = useGetAllBorrowedBooksQuery(`/api/borrowBook/`);

  const [allReqs, setAllReqs] = useState([]);

  useEffect(() => {
    if(isError) {
        toast.error("Failed to fetch Books.")
    }
    if(isSuccess) {
        // console.log("data :::", books?.data);
        const borrowReq = books?.data?.filter((req : any) => req.borrow_status === "PENDING");
        setAllReqs(borrowReq);
    }
  }, [isError, isSuccess])

//   console.log("Borrow Books :::", allReqs);

  return (
    <section className='w-full bg-white p-7 rounded-xl min-h-[400px]'>
        <Toaster />

        <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-xl font-semibold'>Borrow Requests</h1>
        </div>

        {/* Borrow Request */}
        <div className='w-full mt-7 flex flex-col gap-2 '>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
            </div>
          ) : ( (!isError && allReqs.length === 0) ?
            <p className='text-gray-900 text-center mt-12'> No Borrow Request Found </p>
            :
            allReqs.map((req : any) => {
                return (
                    <div key={req._id} className='bg-light-300 rounded-md flex flex-col gap-2 py-2'>
                        <div className="px-4 py-2 flex flex-row items-center space-x-2 gap-3">
                            <Image src={req.coverUrl} width={50} height={50} alt="Service" className="object-contain" />
                            <div>
                                <Link href={`/admin/books/${req.book_id}`} className='hover:underline text-xl font-semibold text-dark-100'> {req.title} </Link>
                                <p className='text-gray-600'> By {req.author}  </p>
                                <div className='flex flex-row mt-2 gap-2 items-center'>
                                    <div
                                        className='h-5 w-5 rounded-full bg-violet-200 flex flex-row justify-center items-center cursor-pointer border-1'
                                        
                                    >
                                        <p className='text-violet-950 text-sm'>{req.username?.charAt(0)}</p>
                                    </div>
                                    <p className='text-dark-700'> {req.username} </p>
                                    <SlCalender size={16} className='ml-4'/>
                                    <p className='text-dark-700'> 
                                        {
                                            req?.requestDate ? 
                                            (
                                                new Date(req.requestDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                            )
                                            :
                                            <p> N/A </p>
                                        } 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
          )
        }
      </div>
    </section>
  )
}

export default BorrowReqCard