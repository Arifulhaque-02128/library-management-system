import React, { ReactNode } from 'react'
import '@/app/style/admin.css'
import Sidebar from '@/components/AdminComponents/Sidebar'
import AdminHeader from '@/components/AdminComponents/AdminHeader'

const AdminLayout = ({children} : {children : ReactNode}) => {

  return (
    <div className='w-full min-h-screen flex flex-row'>
        
        <Sidebar />

        <div className='admin-container'>
            <AdminHeader />
            {children}
        </div>
    </div>
  )
}

export default AdminLayout