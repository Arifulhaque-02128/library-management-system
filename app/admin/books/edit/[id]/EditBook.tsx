'use client'
import BookForm from '@/components/AdminComponents/BookForm/BookForm'
import { Button } from '@/components/ui/button'
import { BookSchema } from '@/lib/authSchema'
import { useGetBookByIdQuery } from '@/lib/Redux/features/handleApi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React from 'react'


const EditBook = () => {

  const { id } = useParams();

//   console.log("ID :::", id);

  const { data: books, isError, isLoading } = useGetBookByIdQuery(`/api/books/${id}`);
  const bookData = books?.data;
  
//   console.log("BOOKKK :::", bookData);

  return (
    <div>
        <Link href={'/admin/books'}>
            <Button className='back-btn'>
                Go Back
            </Button>
        </Link>

        {
            isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
                </div>
                ) : ( !isError && 
                <section className='w-full max-w-2xl'>
                    <BookForm
                        formType='UPDATE_BOOK'
                        schema={BookSchema}
                        defaultValues={bookData}
                    />
                </section>
                )
        }
        
    </div>
  )
}

export default EditBook