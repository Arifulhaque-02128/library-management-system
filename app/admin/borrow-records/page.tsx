import { Metadata } from 'next';
import BorrowRecordPage from './BorrowRecordPage';

export const metadata: Metadata = {
  title: "Borrow Records | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <BorrowRecordPage /> ;
};

export default Page;