import { Metadata, ResolvingMetadata } from 'next';
import SingleBookClient from './SingleBookClient';

const getSingleBook = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/books/${id}`, {
    cache: 'no-store', 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch book data");
  }

  const bookData = await res.json();
  return bookData?.data; 
};

export async function generateMetadata({ params }: { params: { id: string } }, 
    _parent?: ResolvingMetadata ): Promise<Metadata> {

  const { id } = params;
  const bookInfo = await getSingleBook(id);

  return {
    title: `${bookInfo?.title} | Bookari` || "Book | Bookari",
    description: bookInfo?.description || "A Digital Library Management System",
  };
}

const Page = async () => {
  return <SingleBookClient />;
};

export default Page;