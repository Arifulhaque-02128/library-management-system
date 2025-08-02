'use client'
import { useGetUserRequestsQuery } from '@/lib/Redux/features/handleApi';
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const AccountReqCard = () => {

  const { data: users, isError, isLoading } = useGetUserRequestsQuery('/api/userRequests', {
    refetchOnMountOrArgChange: true
  });

  const allReqs = users?.data
//   console.log("ALL USERS :::", allReqs);

  useEffect(() => {
    if(isError){
        toast.error("Failed to fetch user requests");
    };
  }, [isError]);

  if(isError){
    toast.error("Failed to fetch user requests");
  };

  return (
    <section className='w-full bg-white p-7 rounded-xl min-h-[400]'>
        <Toaster />

        <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-xl font-semibold'>Account Requests</h1>
        </div>

        {/* User Request */}
        <div className='w-full mt-7 flex flex-wrap gap-4 justify-center items-center'>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
            </div>
          ) : ( (!isError && allReqs.length === 0) ?
            <p className='text-gray-900'> No Account Request Found </p>
            :
            allReqs.map((req : any) => {
                return (
                    <div key={req._id} className='bg-light-300 rounded-md p-6 flex flex-col justify-center gap-2 items-center cursor-pointer'>
                        <div
                            className='h-12 w-12 rounded-full bg-violet-400 text-violet-950 flex flex-row justify-center items-center border-1'
                        >
                            <p className='text-dark-100 font-semibold'>{req?.username?.charAt(0)}</p>
                        </div>
                        <h1 className='text-lg font-semibold '>
                            { req.username }
                        </h1>
                        <p className='text-dark-800'> {req.email} </p>
                        <p className='text-dark-400'> Library ID : {req.libraryId} </p>
                    </div>
                )
            })
          )
        }
      </div>
    </section>
  )
}

export default AccountReqCard