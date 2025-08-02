import React from 'react'
import BookCover from '../BookCover/BookCover';
import { FcCalendar } from "react-icons/fc";
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BookType {
    author?: string,
    availableCopies?: number,
    coverColor?: string,
    coverUrl?: string,
    createdAt?: string,
    description?: string,
    genre?: string,
    isLoanedBook?: boolean,
    rating?: number,
    summary?: string
    title?: string,
    totalCopies?: number,
    _id?: string
}


interface SingleBookProps {
  bookData: BookType,
  UI? : string,
}

const SingleBook = ({ bookData, UI } : SingleBookProps) => {

//   console.log("Book Data :::", bookData);

  const { coverColor, coverUrl, createdAt, title, author, genre, description, summary, rating, totalCopies, _id, availableCopies} = bookData;

  const isAdmin = UI === "ADMIN";

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return (
    <div className='flex flex-col gap-8'>
        <header className='flex flex-wrap gap-8'>

            {/* book cover */}
            <div className={cn(`relative flex flex-1 justify-center p-6 max-w-[300px] items-center rounded-md bg-opacity-20`)} 
            // @ts-ignore
            style={{ backgroundColor: hexToRGBA(coverColor, 0.9) }}>
                <div className='relative'>
                    <BookCover variant="medium" className="z-20"
                    // @ts-ignore 
                    coverColor={coverColor} 
                    // @ts-ignore
                    coverUrl = {coverUrl} />
                </div>
            </div>

            {/* about book */}
            <div className='flex flex-col gap-4 justify-center'>

                {
                    isAdmin && 
                    <p className='text-gray-500 font-mono flex items-center gap-2 font-semibold'>

                        Created At:

                        <FcCalendar size={25} />
                        
                        <span>
                            {
                                //@ts-ignore
                                new Date(createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }
                        </span>
                    </p>
                }
                
                <p className={cn('font-mono font-bold text-xl lg:text-3xl', isAdmin ? "text-dark-600" : "text-light-100")}> {title} </p>
                <p className={cn('font-semibold lg:text-xl', isAdmin ? "text-dark-500" : "text-light-200")}> By {author} </p>
                <p className={cn('font-semibold lg:text-lg', isAdmin ? "text-dark-500" : "text-light-300")}> Category: {genre} </p>
                
                <p className={cn('text-dark-500 font-semibold lg:text-lg', isAdmin ? "text-dark-500" : "text-light-300")}> Available Copies: <span className={cn( isAdmin ? "text-dark-600" : "text-light-100")}> {availableCopies} </span> &nbsp;&nbsp; Total Copies: <span className={cn( isAdmin ? "text-dark-600" : "text-light-100")}> {totalCopies} </span> </p>

                <p className={cn('font-semibold lg:text-lg', isAdmin ? "text-dark-500" : "text-light-300")}> Rating:  {rating} </p>

                {
                    isAdmin &&
                    <Button className={cn('bg-blue-800 text-white hover:bg-blue-900 py-4 max-w-[300px]')} asChild>
                        <Link href={`/admin/books/edit/${_id}`}> Edit Book </Link>
                    </Button>
                }
                {
                    (!isAdmin && (availableCopies === 0)) &&
                    <p className="text-red-500 font-medium">
                        All copies are currently loaned. Please check again soon!
                    </p>
                }
                {   (!isAdmin && (availableCopies !== 0)) &&
                    <Button className={'bg-light-200 py-4 text-dark-100 font-semibold'} asChild>
                        <Link href={`/books/borrow/${_id}`}> Borrow Book </Link>
                    </Button>
                }
            </div>
        </header>

        <section>
            <div className='mt-12 space-y-4 max-w-6xl text-justify'>
                <h1 className={cn('font-bold text-xl', isAdmin ? "text-dark-100" : "text-light-300")}>Description</h1>
                <p className='text-gray-500'> {description} </p>
            </div>

            <div className='mt-12 space-y-4 max-w-6xl text-justify'>
                <h1 className={cn('font-bold text-xl', isAdmin ? "text-dark-100" : "text-light-300")}>Summary</h1>
                <p className='text-gray-500'> {summary} </p>
            </div>

        </section>
    </div>
  )
}

export default SingleBook