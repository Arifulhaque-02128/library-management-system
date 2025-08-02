import { Metadata } from 'next';
import EditBook from './EditBook';

export const metadata: Metadata = {
  title: "Edit Book Form | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <EditBook /> ;
};

export default Page;