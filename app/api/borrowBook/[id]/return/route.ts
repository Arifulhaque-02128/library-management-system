import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";


export const PUT = async (req: NextRequest, { params }: any) => {
  const { id } = await  params;
  const body = await req.json();

  const { book_id : bookId } = body;

  const {_id, ...rest} = body;

  const returnDate = new Date().toISOString();

  const payload = {
    ...rest,
    returnDate: body.returnDate ?? returnDate,
  };

  try {
    const borrowedCollection = await dbConnect("borrowed_books");
    const bookCollection = await dbConnect("books");

    const updatedRes = await borrowedCollection.updateOne({ _id: new ObjectId(id) }, { $set: payload });

    if (updatedRes.matchedCount === 0) {
      return Response.json({ message: "Book not found" }, { status: 404 });
    }

    const bookObjectId = new ObjectId(bookId);
    const book = await bookCollection.findOne({ _id: bookObjectId });

    if (!book) {
      return Response.json({ message: "Book not available" }, { status: 400 });
    }

    if (book.availableCopies < book.totalCopies) {
      await bookCollection.updateOne({ _id: bookObjectId }, { $inc: { availableCopies: 1 } });
    }

    return Response.json({ message: "Book returned successfully" }, { status: 200 });
  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};
