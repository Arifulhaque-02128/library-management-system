import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const GET = async (req : NextRequest, {params} : {params : {id : string}}) => {

    const { id } = await params;

    try {
        const collection = await dbConnect('borrowed_books');
        const books = await collection.find({libraryId : Number(id)}).toArray();

        // console.log("BOOKSSS :::", books);

        if(!books) {
            return Response.json({message : "Book not found"}, {status : 400});
        } 

        return Response.json({data : books}, {status : 200});

    } catch (error) {
        console.error("SERVER ERROR :::", error);
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}


export const PUT = async (req : NextRequest, { params }: { params: { id: string } }) => {

  const { id } = await params;

  const body = await req.json();
  const { user_email, book_id } = body;

  try {
    const borrowedCollection = await dbConnect("borrowed_books");
    const userCollection = await dbConnect("lib_user");
    const bookCollection = await dbConnect("books");


    const borrowedRes = await borrowedCollection.deleteOne({_id : new ObjectId(id)});

    if(borrowedRes.deletedCount === 0){
        return Response.json({message : "Book not found"}, {status : 400});
    }

    // Update user -> decrement borrowedBooks
    const user = await userCollection.findOne({ email: user_email });
    // console.log("USER :::", user);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 403 });
    }

    // Update user -> decrement borrowedBooks
    await userCollection.updateOne(
      { email: user_email },
      { $inc: { borrowedBooks: -1 } }
    );


    // Update book -> increment availableCopies
    const bookObjectId = new ObjectId(book_id);
    const book = await bookCollection.findOne({ _id: bookObjectId });

    // console.log("BOOK :::", book);
    if (!book) {
      return Response.json({ message: "Book not available" }, { status: 400 });
    }
    // Update book -> increment availableCopies
    await bookCollection.updateOne(
      { _id: bookObjectId },
      { $inc: { availableCopies: 1 } }
    );

    return Response.json({message : "Book deleted successfully"}, {status : 200});

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};


export const PATCH = async (req : NextRequest, { params }: { params: { id: string } }) => {

  const { id } = await params;

  const body = await req.json();

  const { _id, ...rest } = body;

  const due = new Date();
  const dueDate = due.setDate(due.getDate() + 15);

  const payload = {
      ...rest,
      borrow_status : body.borrow_status ?? "BORROWED",
      borrowDate: body.borrowDate ?? new Date(),
      dueDate : body.dueDate ?? dueDate
  };

  try {

    const collection = await dbConnect('borrowed_books');
    const updatedRes = await collection.updateOne({_id : new ObjectId(id)}, {$set : payload});

    if (updatedRes.matchedCount === 0) {
        return Response.json({ message: "Book not found" }, { status: 404 });
    }

    return Response.json({ message: "Book updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};


export const UPDATE = async (req : NextRequest, { params }: { params: { id: string } }) => {

  const { id } = await params;

  const body = await req.json();
  const { book_id, dueDate } = body;

  const {_id, ...rest} = body;

  const returnDate = new Date();

  const payload = {
      ...rest,
      returnDate : body.returnDate ?? returnDate.toISOString(),
      borrow_status : body.borrow_status ?? (new Date(dueDate) < new Date ()) ? "LATE RETURNED" : "RETURNED"
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
