import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyle : Record<BookCoverVariant, string> = {
    extraSmall : "book-cover_extra_small",
    small : "book-cover_small",
    medium : "book-cover_medium",
    regular : "book-cover_regular",
    wide : "book-cover_wide"
};

interface Props {
    className? : string;
    variant? : BookCoverVariant;
    coverColor : string;
    coverUrl : string;
}

const BookCover = ({
        className, variant = "regular", 
        coverUrl = "https://placehold.co/400*600.png", 
        coverColor = "#012B45"
    } : Props) => {

  return (
    <div className={cn("relative transition duration-300", variantStyle[variant],
        className
    )}>
        <BookCoverSvg coverColor={coverColor} />
        <div className='absolute z-10' style={{left : "12%", width : "87.5%", height : "88%"}}>
            <Image
                src={coverUrl} fill alt="Book Cover"
                className='rounded-sm object-fill'
            />
        </div>


    </div>
  )
}

export default BookCover