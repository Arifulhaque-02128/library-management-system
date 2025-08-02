import { Metadata } from 'next';
import AddNewBook from './AddNewBook';

export const metadata: Metadata = {
  title: "Create New Book | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <AddNewBook /> ;
};

export default Page;