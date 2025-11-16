import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { message } from "@/model/user"; //importing message type from user model so that we can use it to type the message object

export async function POST(request: Request) {
    await dbConnect();

    const { username  , content } = await request.json();

    try {
        const user = await UserModel.findOne({ username })
        if(!user){
            return Response.json({
                success: false,
                message: "User not found."
            } , { status: 404 })
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                success: false,
                message: "User is not accepting messages at the moment."
            } , { status: 403 })
        }

        const newMessage = {content , createdAt : new Date()}
        user.messages.push(newMessage as message); //push the new message to the messages array of the user
        await user.save(); //save the user document with the new message
        
        
        return Response.json({
            success: true,
            message: "Message sent successfully."
        } , { status: 200
        })

    } catch (error) {
        console.log("unknown error in sending message" , error)
        return Response.json({
            success: false,
            message: "Internal server error in the sending message."
        } , { status: 500
        })
    }
}