import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const DELETE = async (req : NextRequest, { params }: any ) => {
    
  const { id } = await params

  try {
    const collection = await dbConnect("lib_user");
    const res = await collection.deleteOne({_id : new ObjectId(id)});

    if(res.deletedCount === 0){
        return Response.json({message : "User not found"}, {status : 400});
    }

    return Response.json({message : "User request canceled successfully"}, {status : 200});

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }

};


export const PATCH = async (req : NextRequest, { params }: any ) => {

  const { id } = await params;

  const body = await req.json();

  const { _id, ...rest } = body;

  const payload = {
      ...rest
  };

  // console.log("payload :::", payload);

  try {

    const collection = await dbConnect('lib_user');
    const updatedRes = await collection.updateOne({_id : new ObjectId(id)}, {$set : payload});

    if (updatedRes.matchedCount === 0) {
        return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Account updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};