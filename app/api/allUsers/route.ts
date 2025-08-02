import dbConnect from "@/lib/dbConnect";

export const GET = async () => {
    try {
        const collection = await dbConnect('lib_user');
        const userRequests = await collection.find({ user_status : "APPROVED"}, { projection: { password: 0 } }).toArray();
        
        // console.log("USERS :::", userRequests);

        if(!userRequests){
            return Response.json({ message : "No User Request Found"}, { status : 400});
        }

        return Response.json({ data : userRequests}, {status : 200});
    } catch (error) {
        console.error("SERVER ERROR :::", error);
        return Response.json({ message: "Something went wrong" }, { status: 500 });
    }
}