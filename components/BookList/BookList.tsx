import React from 'react'
import BookCard from '../BookCard/BookCard'

interface Props {
    title : string,
    books : Book[],
    containerClassName? : string
}

const BookList = ({title, books, containerClassName} : Props ) => {
  return (
    <section className={containerClassName}>
        <h2 className='text-light-100 text-2xl'> {title} </h2>

        <div className='book-list'>
          {
            books?.map((book) => {
              return (
                <BookCard key={book._id} {...book} />
              )
            })
          }
        </div>
        
    </section>
  )
}

export default BookList