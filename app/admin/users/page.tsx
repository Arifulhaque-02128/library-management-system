import { Metadata } from 'next';
import AllUserPage from './AllUserPage';

export const metadata: Metadata = {
  title: "All Users | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <AllUserPage /> ;
};

export default Page;