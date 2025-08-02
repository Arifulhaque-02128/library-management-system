import BookList from "@/components/BookList/BookList";
import BookOverview from "@/components/BookOverview/BookOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page | Bookari",
  description: "A Digital Library Management System",
};

const getAllBooks = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/books`);

  if(res?.ok){
    return res.json();
  }
  console.log(res);
  return null
}

export default async function Home() {

  const { data : allBooks} = await getAllBooks();

  // console.log("ALL BOOKSSSS", allBooks);

  return (
    <>
      <BookOverview {...allBooks[0]} pageRoute="HOME" />

      <BookList title="Latest Book" books={allBooks} containerClassName="mt-28" />

    </>
  );
}
