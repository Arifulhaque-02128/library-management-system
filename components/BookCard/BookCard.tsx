import Link from 'next/link'
import React from 'react'
import BookCover from '../BookCover/BookCover'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const BookCard = ({_id, title, genre, coverColor, coverUrl, availableCopies} : Book) => {
  return (
    <div className={cn("hover:bg-dark-100 rounded-md p-4", availableCopies === 0 && "w-full sm:w-52")}>
        <Link href={`/books/${_id}`} 
            className={cn(availableCopies === 0 && "w-full flex flex-col items-center")}
        >
            <BookCover coverColor={coverColor} coverUrl={coverUrl}  />
            <div className={cn('mt-8', !(availableCopies === 0) && "xs:max-w-40 max-w-28")}>
                <p className='book-title'> {title} </p>
                <p className='book-genre'> {genre} </p>
            </div>
        </Link>
        {
            (availableCopies === 0) && 
            <div className='w-full mt-3'>
                <div className='book-loaned text-light-200'>
                    Not Available Now
                </div>

            </div>
        }
    </div>
  )
}

export default BookCard