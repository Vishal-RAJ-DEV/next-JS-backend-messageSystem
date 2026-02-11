import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    //get the session of the user making the request
    const session = await getServerSession(authOptions);
    //store the user from the session in user variable
    const user : User  = session?.user as User ;
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized. Please log in to continue."
        }, { status: 500 })
    }
    const userId = new mongoose.Types.ObjectId(user._id); //convert the user id string to mongoose ObjectId
    try {
        //here what we are doing that we are using aggregation to unwind the messages array and then group them back to get all messages for the user
        // for eg if user has 3 messages then unwind will create 3 documents for that user each with one message and then group will push all those messages back to messages array
        // the group will put all messages in messages array for that user and user id will be same
        const userMessage = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind : '$messages'},
            { $group : {
                _id : '$_id',
                messages : { $push : '$messages' }
            }}
        ])

        if(!userMessage || userMessage.length === 0){
            return Response.json({
                success: false,
                message: "No messages found for the user."
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            messages: userMessage[0].messages  //return the messages array from the first (and only) document in the user array
        } , { status: 200 })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Not authorized to access messages."
        } , { status: 500 })
    }
}