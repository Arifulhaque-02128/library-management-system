'use client'
import { useDeleteBookByIdMutation } from '@/lib/Redux/features/handleApi';
import { removeBook } from '@/lib/Redux/features/handleBooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';


const AllBooks = () => {
//   console.log("ALL BOOKS :::", allBooks);
  const allBooks = useSelector((state : any) => state.bookData.books);
  console.log("BOOKS :::", allBooks);

  const router = useRouter();

  const dispatch = useDispatch();
  const [removeBookId, setRemoveBookId] = useState<any> (null);

  const [deleteBook, { isLoading, isSuccess, isError }] = useDeleteBookByIdMutation();

  const handleDeleteBook = async (bookId : string) => {
    setRemoveBookId(bookId)
    try {
      await deleteBook(`/api/books/${bookId}`);
    } catch (err) {
      console.error("Failed to delete book:", err);
    }
  } 

  useEffect(() => {
    if (isError) {
        toast.error("Failed to delete book");
    }
    if (isSuccess) {
        toast.success("Book deleted successfully");
        dispatch(removeBook(removeBookId));
    }
  }, [isSuccess, isError]);

  return (
    <div className='relative'>
        <Toaster />
        <div className="overflow-x-auto w-full lg:overflow-hidden">
            <table className="min-w-full border-0 shadow text-sm overflow-scroll text-dark-100">
                <thead className="bg-gray-50 uppercase border-0 shadow">
                    <tr>
                    <th className="px-4 py-2 text-left">Book Title</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Genre</th>
                    <th className="px-4 py-2 text-left">Date Created</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
            
                    {
                        allBooks?.map((book : any) => {
                            
                            return (
                                <tr key={book._id} className="hover:bg-gray-100 border-0 shadow font-semibold">
                                    <td className="px-4 py-2 flex flex-row items-center space-x-2">
                                        <Image src={book.coverUrl} width={30} height={20} alt="Service" className="object-contain" />
                                        <Link href={`/admin/books/${book._id}`} className='hover:underline'> {book.title} </Link>
                                    </td>
                                    <td className="px-4 py-2 ">{book.author}</td>
                                    <td className="px-4 py-2 ">{book.genre}</td>
                                    <td className="px-4 py-2 ">
                                        {new Date(book.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-4 py-2 ">
                                        <div className='flex flex-row justify-between items-center'>
                                            <BiSolidEditAlt title="Edit" size={25} className="text-green-600 cursor-pointer"
                                            onClick={() => router.push(`/admin/books/edit/${book?._id}`)}
                                            />
                                            {
                                                (isLoading && removeBookId === book._id) ? 
                                                <div className="flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-primary-admin"></div>
                                                </div>
                                                :
                                                <RiDeleteBinLine title="Delete" size={25} className="text-red cursor-pointer" 
                                                    onClick={() => handleDeleteBook(book._id)}
                                                />
                                            }
                                        </div>
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

export default AllBooks