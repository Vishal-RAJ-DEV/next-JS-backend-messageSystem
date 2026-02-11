import UserModel from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { Message } from "@/model/user";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";

const DELETE = async (
    request : Request,
    { params } : { params : { messageId : string } }
) =>{   
    const { messageId } = params

    await dbConnect();
    const session = await getServerSession(authOptions);

    const user : User  = session?.user 

    if( !user|| !session){
        return Response.json(
            { message : "Unauthorized" },
            { status : 401 }
        )
    }

    try {
        const deleteMessgae = await UserModel.updateOne(
            { _id : user.id },
            { $pull : { messages : { _id : messageId } } }
        )
    
        if( deleteMessgae.modifiedCount === 0 ){
            return Response.json(
                { message : "Message not found or could not be deleted" },
                { status : 404 }
            )
        }

        return Response.json(
            { message : "Message deleted successfully" },
            { status : 200 }
        )
    } catch (error) {
        console.error("Error deleting message:", error);
        return Response.json(
            { message : "Internal Server Error" },
            { status : 500 }
        )
    }

}

export default DELETE;