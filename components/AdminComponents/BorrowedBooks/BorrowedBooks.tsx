'use client'
import { useRejectBorrowReqByIdMutation, useUpdateBorrowStatusMutation, useUpdateOnReturnBookMutation } from '@/lib/Redux/features/handleApi';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';

type BorrowStatus =
  | 'PENDING'
  | 'BORROWED'
  | 'RETURNED'
  | 'LATE RETURNED'

interface BorrowedBookType  {
    book_id : string,
    title : string,
    author : string,
    coverColor : string,
    coverUrl : string,
    username : string,
    user_email : string,
    libraryId : number,
    _id : string,

    requestDate? : string,
    returnDate? : string,
    dueDate? : string,
    borrow_status : BorrowStatus
}

interface BorrowBook {
    borrowedBooks : BorrowedBookType []
}

const BorrowedBooks = ({ borrowedBooks } : BorrowBook) => {

//   console.log("ALL Borrowed BOOKS :::", borrowedBooks);
//   const allBooks = useSelector((state : any) => state.bookData.books);
//   console.log("BOOKS :::", allBooks);

  const [rejectBook, { isLoading : isRejectLoading, isSuccess : isRejectSuccess, isError : isRejectError }] = useRejectBorrowReqByIdMutation();

  const handleRejectBook = async (_id : string, book : BorrowedBookType) => {
    
    try {
      await rejectBook({id : _id, data : book});
    } catch (err) {
      console.error("Failed to reject book:", err)
    }
  } 

  const [approveReq, { isLoading : isApproveLoading, isSuccess : isApproveSuccess, isError : isApproveError }] = useUpdateBorrowStatusMutation();

  const handleApproveReq = async (_id : string, book : BorrowedBookType) => {

    const due = new Date();
    const dueDate = due.setDate(due.getDate() + 15);

    const payload = {
        ...book, 
        borrow_status : "BORROWED",
        borrowDate: new Date(),
        dueDate : dueDate
    }
    try {
      await approveReq({id : _id, data : payload});
    } catch (err) {
      console.error("Failed to approve request:", err)
    }
  }

  const [returnBookReq, { isLoading : isReturnLoading, isSuccess : isReturnSuccess, isError : isReturnError}] = useUpdateOnReturnBookMutation();

  const handleReturnBook = async (_id : string, book : BorrowedBookType, dueDate : Date ) => {

    const returnDate = new Date ();
    // console.log("Return DATE :::", returnDate);
    const borrowStatus = (dueDate < new Date ()) ? "LATE RETURNED" : "RETURNED"
    // console.log("Borrow Status :::", borrowStatus);

    const payload = {...book, borrow_status : borrowStatus, returnDate : returnDate.toISOString()};

    console.log("Payload :::", payload);
    try {
      await returnBookReq({id : _id, data : payload});
    } catch (err) {
      console.error("Failed to return book request:", err)
    }
  }

  useEffect(() => {
    if (isRejectError) {
        toast.error("Failed to Reject Borrow Request");
    }
    if (isRejectSuccess) {
        toast.success("Borrow Request Rejected successfully");
    }

    if (isApproveError) {
        toast.error("Failed to Approve Borrow Request");
    }
    if (isApproveSuccess) {
        toast.success("Borrow Request Approved successfully");
    }

    if (isReturnError) {
        toast.error("Failed to Return Book Request");
    }
    if (isReturnSuccess) {
        toast.success("Return Book Request successfull");
    }
  }, [isRejectSuccess, isRejectError, isApproveSuccess, isApproveError, isReturnError, isReturnSuccess]);


  const [showModal, setShowModal] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
    if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
    ) {
        setShowModal(false);
        setActiveId(null)
    }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative'>
        <Toaster />
        <div className="w-full">
            <table className="min-w-full border-0 shadow text-sm text-dark-100">
                <thead className="bg-gray-50 uppercase border-0 shadow">
                    <tr>
                        <th className="px-4 py-2 text-left">Book</th>
                        <th className="px-4 py-2 text-left">User Requested</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        
                        <th className="px-4 py-2 text-left">Borrowed Date</th>
                        <th className="px-4 py-2 text-left">Returned Date</th>
                        <th className="px-4 py-2 text-left">Due Date</th>
                    </tr>
                </thead>
                <tbody>
            
                    {
                        borrowedBooks?.map((book : any) => {
                            
                            return (
                                <tr key={book._id} className="hover:bg-gray-100 border-0 shadow font-semibold">
                                    <td className="px-4 py-2 flex flex-row items-center space-x-2">
                                        <Image src={book.coverUrl} width={30} height={20} alt="Service" className="object-contain" />
                                        <Link href={`/admin/books/${book.book_id}`} className='hover:underline'> {book.title} </Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <p> {book.username} </p>
                                        <p className='text-dark-100 font-light text-sm'> {book.user_email} </p>
                                    </td>


                                    <td className="px-4 py-2 font-normal relative">
                                        <span
                                            className={cn(
                                                "cursor-pointer p-2 rounded-full",
                                                book.borrow_status === "PENDING" && "bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
                                                book.borrow_status === "BORROWED" &&
                                                book?.dueDate &&
                                                new Date(book.dueDate) < new Date() &&
                                                "bg-red-100 hover:bg-red-200 text-red-700", // Overdue
                                                book.borrow_status === "BORROWED" &&
                                                (!book?.dueDate || new Date(book.dueDate) >= new Date()) &&
                                                "bg-green-100 hover:bg-green-200 text-green-700", // Still within due date
                                                book.borrow_status === "RETURNED" && "bg-blue-200 hover:bg-blue-300 text-blue-700",
                                                book.borrow_status === "LATE RETURNED" && "bg-orange-300 hover:bg-orange-400 text-orange-900"
                                            )}
                                            ref={modalRef}
                                            onClick={() => {
                                                setActiveId(book._id);
                                                setShowModal((prev) => !prev);
                                            }}
                                            >
                                            {
                                                book.borrow_status === "PENDING"
                                                ? "Pending"
                                                : book.borrow_status === "BORROWED" && book?.dueDate && new Date(book.dueDate) < new Date()
                                                ? "Overdue"
                                                : book.borrow_status === "BORROWED"
                                                ? "Borrowed"
                                                : book.borrow_status === "RETURNED"
                                                ? "Returned"
                                                : book.borrow_status === "LATE RETURNED"
                                                ? "Late Returned"
                                                : "Unknown"
                                            }
                                        </span>
                                        { (showModal && activeId === book._id && (book?.borrow_status === "PENDING")) && (
                                            <div className='bg-white px-4 py-2 absolute left-0 mt-2 rounded-md shadow-lg w-48 flex flex-col gap-2 z-50'>
                                                <div className='px-4 py-2 rounded-md cursor-pointer z-100' ref={modalRef}
                                                // onClick={() => router.push(`/user/${data?.user?.libraryId}`)}
                                                >
                                                    <button className='cursor-pointer bg-red-100 hover:bg-red-200 text-red-700 rounded-lg mb-2 py-2 px-4 flex flex-row gap-4' disabled={isRejectLoading}
                                                    onClick={() => handleRejectBook(book._id, book)}
                                                    > 
                                                        <span> Reject  </span>
                                                        {
                                                            isRejectLoading && <div className="w-5 h-5 border-dotted border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                    </button>
                                                    <button className='cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 rounded-lg mb-2 py-2 px-4 flex flex-row gap-4' disabled={isApproveLoading}
                                                    onClick={() => handleApproveReq(book._id, book)}
                                                    > 
                                                        <span> Approve  </span>
                                                        {
                                                            isApproveLoading && <div className="w-5 h-5 border-dotted border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        { (showModal && activeId === book._id && (book?.borrow_status === "BORROWED")) && (
                                            <div className='bg-white px-4 py-2 absolute left-0 mt-2 rounded-md shadow-lg w-48 flex flex-col gap-2 z-50'>
                                                <div className='px-4 py-2 rounded-md cursor-pointer z-100' ref={modalRef}
                                                >
                                                    <button className='cursor-pointer bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-lg mb-2 py-2 px-4 flex flex-row gap-4'
                                                    onClick={() => handleReturnBook(book._id, book, (new Date (book?.dueDate)))}
                                                    > 
                                                        <span> Returned  </span>
                                                        {
                                                            isReturnLoading && <div className="w-5 h-5 border-dotted border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>


                                    <td className="px-4 py-2 ">
                                        {
                                            book?.borrowDate ? 
                                            (
                                                new Date(book.borrowDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                            )
                                            :
                                            <p> N/A </p>
                                        }
                                        
                                    </td>

                                    <td className="px-4 py-2 ">
                                        {
                                            book?.returnDate ? 
                                            (
                                                new Date(book.returnDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                            )
                                            :
                                            <p> N/A </p>
                                        }
                                        
                                    </td>

                                    <td className="px-4 py-2 ">
                                        {
                                            book?.dueDate ? 
                                            (
                                                new Date(book.dueDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                            )
                                            :
                                            <p> N/A </p>
                                        }
                                        
                                    </td>

                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default BorrowedBooks