'use client'
import UserTable from '@/components/UserTable/UserTable';
import { useGetUserRequestsQuery } from '@/lib/Redux/features/handleApi';
import React, { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const AccountReqPage = () => {

  const { data: users, isError, isLoading, refetch } = useGetUserRequestsQuery('/api/userRequests', {
    refetchOnMountOrArgChange: true
  });

  const allReqs = users?.data
  // console.log("ALL USERS :::", allReqs);

  useEffect(() => {
    if(isError){
        toast.error("Failed to fetch user requests");
    };
  }, [isError]);

  if(isError){
    toast.error("Failed to fetch user requests");
  };

  return (
    <section className='w-full bg-white p-7 rounded-xl'>
        <Toaster />

        <div className='flex flex-wrap justify-between items-center gap-2'>
            <h1 className='text-xl font-semibold'>Account Registration Request</h1>
        </div>

        {/* User Request Table */}
        <div className='w-full mt-7 min-h-[300px]'>
        {
          isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary-admin"></div>
            </div>
          ) : ( !isError &&
            <UserTable userRequests={allReqs} refetch={refetch} userStatus="PENDING" />
          )
        }
      </div>
    </section>
  )
}

export default AccountReqPage