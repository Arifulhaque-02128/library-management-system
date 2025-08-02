'use client'
import { useApproveAccountRequestMutation, useRejectAccountRequestMutation } from '@/lib/Redux/features/handleApi';
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { Button } from '../ui/button';
import { MdCancel } from "react-icons/md";
import { cn } from '@/lib/utils';


interface UserType {
    createdAt: string
    email : string
    lastActivityDate : string
    libraryId :  number, 
    role :  string, 
    user_status :  string, 
    username :  string, 
    _id :  string,
    borrowedBooks? : number
}

interface UserReqProps {
    userRequests : UserType[],
    refetch : () => void,
    userStatus : string
}



const UserTable = ({ userRequests, refetch, userStatus } : UserReqProps) => {

  const [rejectRequest, { isLoading : isRejectLoading, isSuccess : isRejectSuccess, isError : isRejectError }] = useRejectAccountRequestMutation();
  const [updateRequest, { isLoading : isUpdateLoading, isSuccess : isUpdateSuccess, isError :  isUpdateError}] = useApproveAccountRequestMutation();

  const [selectedId, setSelectedId] = useState<string>("")

  const handleRejectUser = async (userId : string) => {
    setSelectedId(userId);
    try {
        await rejectRequest(`/api/userRequests/${userId}`).unwrap();
        refetch(); 
    } catch (err) {
        console.error("Reject error:", err);
        setSelectedId("");
    }
     
  } 

  const handleApproveReq = async (userId : string, user : UserType) => {
    setSelectedId(userId);
    const payload = {...user, user_status : "APPROVED"}
    try {
        await updateRequest({id : userId, data : payload}).unwrap();
        refetch(); 
    } catch (err) {
        console.error("Approval error:", err);
        setSelectedId("");
    }
  }

  const handleMakeAdmin = async (userId : string , user : UserType) => {
    setSelectedId(userId);
    const payload = {...user, role : "ADMIN"}
    try {
        await updateRequest({id : userId, data : payload}).unwrap();
        refetch(); 
    } catch (err) {
        console.error("User role update error:", err);
        setSelectedId("");
    }
  }

  const handleMakeUser = async (userId : string , user : UserType) => {
    setSelectedId(userId);
    const payload = {...user, role : "USER"}
    try {
        await updateRequest({id : userId, data : payload}).unwrap();
        refetch(); 
    } catch (err) {
        console.error("User role update error:", err);
        setSelectedId("");
    }
  }

  useEffect(() => {
    if (isRejectError) {
        toast.error("User Rejection Failed");
        setSelectedId("");
    } else if (isRejectSuccess) {
        toast.success("User deleted successfully");
        setSelectedId("");
    } else if (isUpdateError){
        toast.success("Account update failed");
        setSelectedId("");
    } else if (isUpdateSuccess){
        toast.success("Account update successfully");
        setSelectedId("");
    }
  }, [isRejectSuccess, isRejectError, isUpdateSuccess, isUpdateError]);

  if(userRequests.length === 0) {
    return <p className='text-dark-100 text-center text-xl mt-12'>
        {
            userStatus === "PENDING" ?
            "No Request Found"
            :
            "No User Found"
        }
    </p>
  }

  return (
    <div className='relative'>
        <Toaster />
        <div className="overflow-x-auto w-full lg:overflow-hidden">
            <table className="min-w-full border-0 shadow text-sm overflow-scroll text-dark-100">
                <thead className="bg-gray-50 uppercase border-0 shadow">
                    <tr>
                        <th className="px-4 py-2 text-left text-dark-700">User Name</th>
                        {
                            userStatus === "PENDING" ? null : 
                            <th className="px-4 py-2 text-left text-dark-700">Role</th>
                        }
                        {
                            userStatus === "PENDING" ? null : 
                            <th className="px-4 py-2 text-left text-dark-700">Book Borrowed</th>
                        }
                        <th className="px-4 py-2 text-left text-dark-700">Data Joined</th>
                        <th className="px-4 py-2 text-left text-dark-700">Library ID</th>
                        <th className="px-4 py-2 text-left text-dark-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
            
                    {
                        userRequests?.map((user : UserType) => {
                            
                            return (
                                <tr key={user._id} className="border-0 shadow font-semibold">
                                    <td className="px-4 py-2 flex flex-row items-center space-x-2">

                                        <div
                                        className='h-12 w-12 rounded-full bg-indigo-300 flex flex-row justify-center items-center cursor-pointer border-2 shadow'
                                        >
                                            <p className='text-white font-semibold'>{user.username?.slice(0, 2).toUpperCase()}</p>
                                        </div>

                                        <div>
                                            <p className='text-dark-100'> {user.username} </p>
                                            <p className='text-dark-700 font-normal'> {user.email} </p>
                                        </div>
                                    </td>
                                    
                                        {
                                            userStatus === "PENDING" ? null : 
                                            <td className="px-4 py-2"> 
                                                <p className={cn("p-2 text-center rounded-full max-w-16", user.role === "USER" ? "bg-pink-200 text-pink-800" : "bg-emerald-200 text-emerald-900")}>
                                                    {user.role} 
                                                </p>
                                            </td>
                                        }

                                        {
                                            userStatus === "PENDING" ? null : 
                                            <td className="px-4 py-2"> 
                                                <p className='text-dark-600 max-w-12 text-center'>
                                                    {user?.borrowedBooks ?? 0} 
                                                </p>
                                            </td>
                                        }
                                    <td className="px-4 py-2 text-dark-600">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-4 py-2 text-dark-600">{user.libraryId}</td>
                                    <td className="px-4 py-2">
                                        <div className='flex flex-row justify-between items-center'>
                                            {
                                                userStatus === "PENDING" ?
                                                <Button className='bg-purple-200 hover:bg-purple-300 outline-none text-purple-900 flex items-center justify-center'
                                                    onClick={() => handleApproveReq(user._id, user)}
                                                    > 
                                                    {
                                                        (selectedId === user._id  && isUpdateLoading) ? 
                                                        <div className="w-4 h-4 border-2 border-dotted rounded-full animate-spin border-purple-950"></div>
                                                        :
                                                        ""
                                                    }
                                                    Approve 
                                                </Button>
                                                :
                                                (
                                                    user.role === "USER" ? 
                                                    <Button className='bg-emerald-200 text-emerald-900 hover:bg-emerald-300 outline-none flex items-center justify-center'
                                                        onClick={() => handleMakeAdmin(user._id, user)}
                                                    > 
                                                        {
                                                            (selectedId === user._id  && isUpdateLoading) ? 
                                                            <div className="w-4 h-4 border-2 border-dotted rounded-full animate-spin border-emerald-950"></div>
                                                            :
                                                            ""
                                                        }
                                                        Make Admin 
                                                    </Button>
                                                    :
                                                    <Button className='bg-pink-200 text-pink-800 hover:bg-pink-300 outline-none flex items-center justify-center'
                                                        onClick={() => handleMakeUser(user._id, user)}
                                                    > 
                                                        {
                                                            (selectedId === user._id  && isUpdateLoading) ? 
                                                            <div className="w-4 h-4 border-2 border-dotted rounded-full animate-spin border-pink-950"></div>
                                                            :
                                                            ""
                                                        }
                                                        Make User 
                                                    </Button>
                                                )
                                            }
                                            
                                            {
                                                (selectedId === user._id  && isRejectLoading) ?
                                                    <div className="flex items-center justify-center">
                                                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-red"></div>
                                                    </div>
                                                 
                                                :
                                                <MdCancel size={25} title='Reject' className='cursor-pointer text-red' 
                                                    onClick={() => handleRejectUser(user._id)}
                                                />
                                            }
                                            
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default UserTable