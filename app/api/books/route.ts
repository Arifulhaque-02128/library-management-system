import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const collection = await dbConnect("books");
    const allBooks = await collection.find({}).toArray();
    return Response.json({ data: allBooks }, { status: 200 });
  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const payload = {
      ...body,
      isLoanedBook: body.isLoanedBook ?? body.totalCopies <= 0,
      availableCopies: body.availableCopies ?? body.totalCopies,
      createdAt: body.createdAt ?? new Date(),
    };

    const collection = await dbConnect("books");
    const res = await collection.insertOne(payload);

    return Response.json(
      {
        data: res,
        message: "Book inserted successfully.",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};