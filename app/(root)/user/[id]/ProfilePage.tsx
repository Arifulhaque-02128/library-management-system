'use client'
import BookCover from '@/components/BookCover/BookCover'
import { useGetBorrowedBookByLibIdQuery } from '@/lib/Redux/features/handleApi'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { MdOutlineVerified } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";

const ProfilePage = () => {
  const {id} = useParams();
  // console.log("IDDD :::", id);

  const { data : books, isLoading, isSuccess, isError } = useGetBorrowedBookByLibIdQuery(`/api/borrowBook/${id}`);

  const router = useRouter();

  // console.log("BOOKS :::", books?.data);

  const { data } = useSession();

  // console.log("SESSION DATA :::", data );

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  function getDueDateMessage(dueDate: string | Date): string {
    if (!dueDate) return "";

    const due = new Date(dueDate);
    const today = new Date();

    // Zero out time to avoid off-by-one errors
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = due.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft > 0) {
      return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left to return`;
    } else if (daysLeft === 0) {
      return `Due today`;
    } else {
      return `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? 's' : ''}`;
    }
  }

  return (
    <section className='flex flex-wrap max-w-8xl justify-evenly'>
      
      {/* Profile Info */}
      <div className='flex flex-col gap-12 bg-dark-400 p-8 rounded-lg max-w-xl'>

        <div className='flex flex-row items-center gap-2'>
          <div
              className='h-24 w-24 rounded-full bg-red-500 flex flex-row justify-center items-center cursor-pointer border-dark-700 border-4'
          >
              <p className='text-white font-semibold'>{data?.user.username?.slice(0,2)}</p>
          </div>
          <div className='space-y-2'>
            {
              data?.user?.user_status === "APPROVED" ?
              <p className='flex flex-row space-x-2 items-center'>
                <MdOutlineVerified className='text-green-500' size={25}/>
                <span className='text-light-100'> Account Verified </span>
              </p>
              :
              ""
            }

            <h1 className='text-2xl font-bold'> {data?.user?.username} </h1>
            <p className='text-light-100'> {data?.user?.email} </p>
          </div>
        </div>

        <div className='space-y-6'>

          <div className='space-y-2'>
            <p> Library ID</p>
            <h1 className='text-lg font-semibold'> {data?.user?.libraryId} </h1>
          </div>

          <div className='space-y-2 max-w-lg'>
            <p> Institution Name </p>
            <h1 className='text-lg font-semibold'> Chittagong University of Engineering and Technology </h1>
          </div>

          <div className='space-y-2'>
            <p> Mobile </p>
            <h1 className='textlg font-semibold'> 0178882324 </h1>
          </div>

          <div className='space-y-2'>
            <p> Date of Birth </p>
            <h1 className='text-lg font-semibold'> 12/16/1998 </h1>
          </div>

        </div>

      </div>
      


      {/* Borrowed Books */}
      <div className='min-w-[350] rounded-md'>
        <h1 className='text-xl text-light-100 mb-6'>Borrowed Books</h1>

        {
          isLoading ? ( 
                <div className="flex items-center justify-center mt-12">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-dark-700"></div>
                </div> )
          :
          (
            (!isError && (books?.data?.length === 0)) ?
            <p className='text-lg text-light-100 text-center mt-24 w-xl'> No Book Found </p>
            : 
            <div className='flex flex-wrap gap-4'>
              {
                books?.data?.map((book : any) => {
                  return (
                    <div key={book._id} className='bg-dark-100 p-4 rounded w-[280] cursor-pointer'
                    onClick={ () => router.push(`/books/${book.book_id}`)}
                    > 
                      {/* book cover */}
                      <div className="relative flex flex-1 justify-center w-[200] p-6 items-center rounded-md"
                      // @ts-ignore
                      style={{ backgroundColor: hexToRGBA(book.coverColor, 0.5) }}>
                          <div className='relative'>
                              <BookCover variant="medium" className="z-20"
                              // @ts-ignore 
                              coverColor={book.coverColor} 
                              // @ts-ignore
                              coverUrl = {book.coverUrl} />
                          </div>
                      </div>
                      <p className='text-xl text-light-100 font-bold mt-6'> {book.title} </p>
                      <p className='mt-2 text-light-100 font-ibm-plex-sans'> By {book.author} </p>
                
                      {
                        !book?.borrowDate && 
                        <div>
                          <p className='mt-3 flex flex-row items-center gap-2'> 
                            <FaBookOpen size={20} />
                            <span className='text-light-200'> Borrow Request Sent  </span>
                          </p>
                          <p className='mt-3 flex flex-row items-center gap-2'> 
                            <CiClock2 size={20} />
                            <span className='text-orange-400 text-sm'>  Wait for the request approval  </span>
                          </p>
                        </div>
                      }

                      {
                        ( book?.borrowDate && !book?.returnDate ) &&
                        <div>
                          <p className='mt-3 flex flex-row items-center gap-2'> 
                            <FaBookOpen size={20} />
                            <span className='text-light-200 text-sm'> Borrowed On : &nbsp;
                              {
                                  new Date(book.borrowDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                  })
                              }
                            </span>
                          </p>
                          { book?.dueDate && (
                            <p className='mt-3 flex flex-row items-center gap-2'> 
                              <CiClock2 size={20} />
                              <span className='text-orange-400 text-sm'>
                                {getDueDateMessage(book.dueDate)}
                              </span>
                            </p>
                          )}
                        </div>
                      }

                      {
                        ( book?.borrowDate && book?.returnDate ) &&
                        <div>
                          <p className='mt-3 flex flex-row items-center gap-2'> 
                            <FaBookOpen size={20} />
                            <span className='text-light-200 text-sm'> Borrowed On : &nbsp;
                              {
                                  new Date(book.borrowDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                  })
                              }
                            </span>
                          </p>
                          
                          <p className='mt-3 flex flex-row items-center gap-2'> 
                            <CiClock2 size={20} />
                            <span className='text-green-600 text-sm'> Returned On : &nbsp;
                              {
                                  new Date(book.returnDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                  })
                              }
                            </span>
                          </p>
              
                        </div>
                      }
    
                    </div>
                  )
                })
              }
            </div> 
          )
          
        }
        
      </div>

    </section>
  )
}

export default ProfilePage