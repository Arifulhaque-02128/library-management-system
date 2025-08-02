import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
const bcrypt = require('bcrypt');

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { password, email, libraryId } = body;

    const collection = await dbConnect("lib_user");
    const userExist = await collection.findOne({
      $or: [
        { email: email },
        { libraryId: libraryId }
      ]
    });

    if(userExist){
      return Response.json({message : "User already exists"}, { status : 400 })
    }

    if(!password) {
      return Response.json({message : "Password is required"}, {status : 400});
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const payload = {
      ...body,
      password : hashedPassword,
      user_status: body.user_status ?? "PENDING",
      role: body.role ?? "USER",
      lastActivityDate: body.lastActivityDate ?? new Date(),
      borrowedBooks : body.borrowedBooks ?? 0,
      createdAt: body.createdAt ?? new Date(),
    };

    // console.log("BODY :::", payload);

    
    const res = await collection.insertOne(payload);

    console.log("SERVER :::", res);

    return Response.json({
      data: res,
      message: "User created successfully."
    }, { status: 202 });

  } catch (error) {
    console.error("SERVER ERROR :::", error);
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};