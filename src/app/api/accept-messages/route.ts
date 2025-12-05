//this is used to get the session of the user that is making the request
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";

//this post request is used to accept or decline messages from other users by updating the isAcceptingMessages field in the user document in the database
export async function POST(request: Request) {
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

    const userId = user._id;
    const { isAcceptingMessages } = await request.json();

    try {
        const UpdatedUser = await UserModel.findByIdAndUpdate(
             userId,
            {
                isAcceptingMessages : isAcceptingMessages

            },
            { new : true } //this option is used to return the updated document

        )
        if(!UpdatedUser){
            return Response.json({
                success: false,
                message: "User not found."
            } , { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message acceptance preference updated successfully."
        } , { status: 200 })


    } catch (error) {
        console.error("Error updating message acceptance preference:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}

//now this get request is used to get the current user's message acceptance preference
export async function GET(request: Request) {
    await dbConnect();

    //get the session of the user making the request
    const session = await getServerSession(authOptions);
    //store the user from the session in user variable
    const user : User  = session?.user as User ; //here we are asserting that session.user is of type User and  user is of type User( here the User type is imported from next-auth which represents the user object in the session)

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized. Please log in to continue."
        }, { status: 500 })
    }
    const userId = user._id;
    
    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({
                success: false,
                message: "User not found."
            } , { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })

    } catch (error) {
        console.error("Error fetching message acceptance preference:", error);
        return Response.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}