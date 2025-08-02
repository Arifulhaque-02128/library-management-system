import { Metadata } from 'next';
import BookPage from './BookPage';

export const metadata: Metadata = {
  title: "All Books | Bookari",
  description: "A Digital Library Management System",
};

const Page = async () => {
  return <BookPage /> ;
};

export default Page;