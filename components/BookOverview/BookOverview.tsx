'use client'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import BookCover from '../BookCover/BookCover'
import { usePostBorrowBookMutation } from '@/lib/Redux/features/handleApi'
import { useSession } from 'next-auth/react'
import toast, { Toaster } from 'react-hot-toast'

interface BookProps extends Book {
    pageRoute : string
}


const BookOverview = ({ _id, title, author, genre, rating, availableCopies, description, coverUrl, coverColor, pageRoute} : BookProps) => {
  
  const isHomePage = pageRoute === "HOME";

  const [postBorrowBook, { isLoading, isError, isSuccess }] = usePostBorrowBookMutation();

  const { data } = useSession();

//   console.log("USER DATA :::", data?.user);

  const handleBorrowBook = async () => {

    if(!data?.user) {
        toast.error("Please, Login first")
    } else {
        // @ts-ignore
        const { email, libraryId, user_status, username } = data?.user;

        if (user_status === "PENDING") {
            toast.error("Your account is not authenticated yet. Only approved accounts can borrow books.");
            return;
        }

        const payload = {
            title,
            book_id: _id,
            coverColor,
            coverUrl,
            author,
            user_email: email,
            libraryId,
            username,
            borrow_status: "PENDING"
        };

        try {
            const response = await postBorrowBook({ data: payload }).unwrap(); 
            toast.success(response.message || "Request sent successfully.");
        } catch (error: any) {
            // if error has a message from server
            const errorMessage = error?.data?.message || "Request failed.";
            toast.error(errorMessage);
        }
    }
  };

  return (
    <section className='book-overview'>
        <Toaster />
        <div className='flex flex-1 flex-col gap-4'>

            <h1> {title} </h1>

            <div className='book-info'>
                <p>By <span className='text-light-200 font-semibold'> {author} </span> </p>
                <p>  category <span className='text-light-200 font-semibold'> {genre} </span> </p>
            </div>

            <div className='flex flex-row items-center space-x-2'>
                <Image src={'/icons/star.svg'} height={25} width={25} alt='rating' />
                <p> {rating} </p>
            </div>

            <div className='book-copies'>
                {/* <p>Total Book <span className='text-light-200'> {totalCopies} </span> </p> */}
                <p>Available Book <span className='text-light-200'> {availableCopies} </span> </p>
            </div>

            {
                isHomePage && <p className='book-description'> {description} </p>
            }

            {
                (availableCopies === 0) ?
                <p className="text-red-500 font-medium">
                    All copies are currently loaned. Please check again soon!
                </p>
                :
                <Button className='book-overview_btn' disabled={isLoading} onClick={handleBorrowBook}>
                    {
                        isLoading ? 
                        <div className="flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-dark-100"></div>
                        </div> 
                        :
                        <Image src={'/icons/book.svg'} height={25} width={25} alt='' />
                    }
                    
                    <p className='text-xl text-dark-100'>Borrow Book</p>
                </Button>
            }
        </div>

        <div className='relative flex flex-1 justify-center'>
            <div className='relative'>
                <BookCover variant="wide" className="z-10" coverColor={coverColor} coverUrl = {coverUrl} />
            </div>
            <div className='absolute left-24 rotate-12 top-10 opacity-10 max-sm:hidden'>
                <BookCover variant="wide" coverColor={coverColor} coverUrl = {coverUrl} />
            </div>
        </div>
        
    </section>
  )
}

export default BookOverview