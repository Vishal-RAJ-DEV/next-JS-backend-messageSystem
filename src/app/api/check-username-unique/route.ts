import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z} from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
//define a zod schema for validating the username query parameter
const usernameQuerySchema = z.object({
    username: usernameValidation, //here we reuse the username validation schema
})

//this route handler checks if a username is unique by validating the query parameter and checking the database 
// and also ensures that only verified users are considered for uniqueness check
export async function GET(request: Request) {
    await dbConnect();

    try {
        //this is used to extract query parameters from the request URL for eg ?username=johndoe then username=johndoe
        const { searchParams } = new URL(request.url);
        //get the username from the query params and validate it
        const queryParam = {
            username : searchParams.get("username") || "",
        }

        //now validate the query param using zod schema
        const result = usernameQuerySchema.safeParse(queryParam);
        console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message : usernameErrors.length > 0 ? usernameErrors.join(", ") : "Invalid query parameter"
                },
                { status: 400 }
            )
        }

        const { username } = result.data;
        //check if the username already exists in the database and is verified
        const existingVerifiedUser = await UserModel.findOne({username , isVerified: true})
        if (existingVerifiedUser) {  // username is already taken by a verified user
            return Response.json({
                success : false,
                message : "Username is already taken",
            }, { status: 500 })
        }

        return Response.json({  //else the username is unique but not taken so available
            success: true,
            message: "Username is unique and available",
        }, { status: 200 })


    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
            { 
                success: false,
                message: "Internal server error" 
            },
            { status: 500 }
        )
    }
}