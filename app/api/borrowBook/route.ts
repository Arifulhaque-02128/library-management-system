import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";


export const GET = async (req : NextRequest) => {

    try {
        const collection = await dbConnect('borrowed_books');
        const books = await collection.find({}).toArray();

        // console.log("BOOKSSS :::", books);

        if(books.length === 0 ) {
            return Response.json({message : "No Book found"}, {status : 400});
        } 

        return Response.json({data : books}, {status : 200});

    } catch (error) {
        console.error("SERVER ERROR :::", error);
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { user_email, book_id } = body;

    // console.log("BODY :::", body);

    if (!user_email || !book_id) {
      return Response.json({ message: "Missing email or book ID" }, { status: 400 });
    }

    const userCollection = await dbConnect("lib_user");
    const bookCollection = await dbConnect("books");
    const borrowedBookCollection = await dbConnect("borrowed_books");

    const user = await userCollection.findOne({ email: user_email });
    // console.log("USER :::", user);
    if (!user || user.user_status !== "APPROVED") {
      return Response.json({ message: "User not found or not approved" }, { status: 403 });
    }

    const bookObjectId = new ObjectId(book_id);
    const book = await bookCollection.findOne({ _id: bookObjectId });

    // console.log("BOOK :::", book);
    if (!book || book.availableCopies < 1) {
      return Response.json({ message: "Book not available" }, { status: 400 });
    }

    const alreadyBorrowed = await borrowedBookCollection.findOne({
        user_email: user_email,
        book_id: book_id,
        borrow_status: { $in: ["PENDING", "BORROWED"] }
    });

    // console.log("BORROWED BOOK :::", alreadyBorrowed);

    if (alreadyBorrowed) {
      return Response.json({ message: "Book already borrowed by user" }, { status: 409 });
    }

    const payload = {
      ...body,
      requestDate: new Date(),
    };

    // Update user -> increment borrowedBooks
    await userCollection.updateOne(
      { email: user_email },
      { $inc: { borrowedBooks: 1 } }
    );

    // Update book -> decrement availableCopies
    await bookCollection.updateOne(
      { _id: bookObjectId },
      { $inc: { availableCopies: -1 } }
    );

    // Insert record into borrowed_books
    await borrowedBookCollection.insertOne(payload);

    return Response.json({ message: "Book borrowed successfully" }, { status: 200 });

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};
