import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";


export const DELETE = async (req : NextRequest, { params }: { params: { id: string } }) => {
  const { id } = await params
  try {
    const collection = await dbConnect("books");
    const res = await collection.deleteOne({_id : new ObjectId(id)});

    if(res.deletedCount === 0){
        return Response.json({message : "Book not found"}, {status : 400});
    }

    return Response.json({message : "Book deleted successfully"}, {status : 200});

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};

export const GET = async (req : NextRequest, {params} : {params : {id : string}}) => {
    const { id } = await params;

    try {
        const collection = await dbConnect('books');
        const book = await collection.findOne({_id : new ObjectId(id)});

        if(!book) {
            return Response.json({message : "Book not found"}, {status : 400});
        } 

        return Response.json({data : book}, {status : 200})

    } catch (error) {
        console.error("SERVER ERROR :::", error);
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export const PATCH = async (req : NextRequest, { params }: { params: { id: string } }) => {

  const { id } = await params;

  const body = await req.json();

  const { _id, ...rest } = body;

  const payload = {
      ...rest,
      isLoanedBook: body.isLoanedBook ?? (body?.totalCopies > 0 ? false : true),
      availableCopies : body.availableCopies ?? body.totalCopies,
      createdAt: body.createdAt ?? new Date(),
  };

  // console.log("payload :::", payload);

  try {

    const collection = await dbConnect('books');
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