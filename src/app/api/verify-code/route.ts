import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

//this api route handles the verification of the code sent to the user's email during registration process
// it checks if the code is valid and not expired, then marks the user as verified in the database
export async function POST(request: Request) {
    try {
        await dbConnect();

        const { username , code } = await request.json(); // get username and code from request body
        const decodedUsername = decodeURIComponent(username); //so the username with special characters can be handled by decoding it

        const user =  await UserModel.findOne({
            username: decodedUsername,
        })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found."
                },
                { status: 404 }
            )
        }
        //check the given code matches with the code stored in the database 
        const isCodeValid = user.verifiedcode === code;
        //check the code is not expired by comparing current date with expiry date
        const isCodeNotExpired = new Date(user.verifiedCodeExpiry) > new Date();

        // is both code is valid and not expired
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;  // set user as verified as true
            await user.save();
            return Response.json({
                success: true,
                message: "Code verified successfully."
            }, { status: 200 })
        }

        //handle different error scenarios
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verification code has expired."
            }, { status: 400 })
        }
        else{
            return Response.json({
                success: false,
                message: "Invalid verification code."
            }, { status: 400
            })
        }

        
    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}