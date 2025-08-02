import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const PUT = async (req : NextRequest, { params }: { params: { id: string } }) => {

  const { id } = await params;

  const body = await req.json();
  const { book_id, dueDate } = body;

  const {_id, ...rest} = body;

  const returnDate = new Date();

  const payload = {
      ...rest,
      returnDate : body.returnDate ?? returnDate.toISOString()
  };

  try {
    const borrowedCollection = await dbConnect("borrowed_books");
    const bookCollection = await dbConnect("books");


    const updatedRes = await borrowedCollection.updateOne({_id : new ObjectId(id)}, {$set : payload});

    if (updatedRes.matchedCount === 0) {
        return Response.json({ message: "Book not found" }, { status: 404 });
    }


    // Update book -> increment availableCopies
    const bookObjectId = new ObjectId(book_id);
    const book = await bookCollection.findOne({ _id: bookObjectId });

    // console.log("BOOK :::", book);
    if (!book) {
      return Response.json({ message: "Book not available" }, { status: 400 });
    }
    // Update book -> increment availableCopies
    if (book.availableCopies < book.totalCopies) {
      await bookCollection.updateOne(
        { _id: bookObjectId },
        { $inc: { availableCopies: 1 } }
      );
    }

    return Response.json({message : "Book Returned successfully"}, {status : 200});

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};
