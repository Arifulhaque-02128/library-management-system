import AccountReqCard from '@/components/AdminComponents/AccountReqCard/AccountReqCard';
import BorrowReqCard from '@/components/AdminComponents/BorrowReqCard/BorrowReqCard';
import React from 'react'

const getAllUsers = async () => {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(baseUrl+"/api/allUsers");
  if(res?.ok){
    return res.json();
  }
  console.log(res);
  return 
  
};

const getAllBooks = async () => {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(baseUrl+"/api/books");
  if(res?.ok){
    return res.json();
  }
  console.log(res);
  return 
  
};

const getAllBorrowedBooks = async () => {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(baseUrl+"/api/borrowBook");
  if(res?.ok){
    return res.json();
  }
  console.log(res);
  return 
};

const AdminPage = async () => {

  const allUsers = await getAllUsers()
  const totalUsers = allUsers?.data?.length;
  // console.log("Total Users :::", totalUsers);

  const allBooks = await getAllBooks()
  const totalBooks = allBooks?.data?.length;
  // console.log("Total Books :::", totalBooks);

  const allBorrowBooks = await getAllBorrowedBooks()
  const totalBorrowBooks = allBorrowBooks?.data?.length;
  // console.log("Total Borrow Books :::", totalBorrowBooks);

  let cardItems : any = [];

  if((totalBooks >= 0 ) && (totalUsers >= 0 ) && (totalBorrowBooks >= 0 )) {
    cardItems = [{ amount : totalUsers, cardTitle : "Total Users" }, { amount : totalBooks, cardTitle : "Total Books" }, { amount : totalBorrowBooks, cardTitle : "Borrow Books"}];
  }

  return (
    <div>
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {cardItems?.length !== 0 &&
          cardItems?.map((item: any) => (
            <div key={item.cardTitle} className="bg-white py-6 px-6 rounded-md w-full">
              <h1 className="text-xl font-semibold text-dark-600">{item.cardTitle}</h1>
              <p className="text-2xl font-bold text-dark-100 mt-4">{item.amount}</p>
            </div>
          ))}
      </div>

      {/* main dashboard */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-12'>
        {/* Borrow Requests */}
        <div>
          <BorrowReqCard />
        </div>

        {/* Account Requests */}
        <div>
          <AccountReqCard />
        </div>
      </div>
    </div>
  )
}

export default AdminPage