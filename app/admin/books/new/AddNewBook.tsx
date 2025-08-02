import BookForm from '@/components/AdminComponents/BookForm/BookForm'
import { Button } from '@/components/ui/button'
import { BookSchema } from '@/lib/authSchema'
import Link from 'next/link'
import React from 'react'


interface bookDefaultValues {
  title : string,
  description : string,
  author : string,
  genre : string,
  summary : string,
  rating : number,
  totalCopies : number,
  coverUrl : string,
  coverColor : string
}

const AddNewBook = () => {

  const defaultValues : bookDefaultValues = {
    title : "",
    description : "",
    author : "",
    genre : "",
    summary : "",
    rating : 1,
    totalCopies : 1,
    coverUrl : "",
    coverColor : ""
  }

  return (
    <div>
        <Link href={'/admin/books'}>
            <Button className='back-btn'>
                Go Back
            </Button>
        </Link>

        <section className='w-full max-w-2xl'>
            <BookForm
                formType='CREATE_NEW_BOOK'
                schema={BookSchema}
                defaultValues={
                  defaultValues
                }
            />
        </section>
    </div>
  )
}

export default AddNewBook