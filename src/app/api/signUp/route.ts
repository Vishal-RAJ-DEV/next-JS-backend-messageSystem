import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

export async function POST(request: Request) {
    await dbConnect(); //here we connect to the database

    try {
        // Destructure the request body
        //take the input form the user from the front end
        const { username, email, password } = await request.json()

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return Response.json({
                success: false,
                message: "Invalid email format provided."
            }, { status: 400 })
        }

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: username,
            isVerified: true
        })
        //if the user already exists then we will not allow to register again with the same email or username
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists."

                },
                {
                    status: 400
                }
            )
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({
            email: email,
        })

        //creating a verify code for email verification
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code

        if (existingUserVerifiedByEmail) {
            //this means the email is already registered and verified so no need to register again
            if(existingUserVerifiedByEmail.isVerified) { //if this will true then the user is already verified
                return Response.json({
                    success: false,
                    message: "Email already exists."
                }, {status: 400})
            }else{
                //here what happen that if the user is already registered but not verified then we will update the username,password,verification code and expiry date so that the user can verify with the new code and username and password
                const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 1); // Set expiry date to 1 day from now

                existingUserVerifiedByEmail.username = username;
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifiedcode = verificationCode;
                existingUserVerifiedByEmail.verifiedCodeExpiry = expiryDate;
                await existingUserVerifiedByEmail.save(); // Save the updated user to the database
            }
        } else {
            // Hash the password before saving to the database
            const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt rounds
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1); // Set expiry date to 1 day from now
            // Create a new user instance
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifiedcode: verificationCode,
                verifiedCodeExpiry: expiryDate,
                isVerified: false, //by default false
                isAcceptingMessages: true, //default value is true,
                messages: [] //array of message
            })
            await newUser.save(); // Save the new user to the database
        }
        
        //this function only sends the vefication code when the user is registered successfully and not verified yet and also if the user is already registered but not verified then also it will send the verification code again
        // Send verification email - Note: parameters are (email, username, verificationCode)
        const emailResponse = await sendVerificationEmail(email.trim().toLowerCase(), username, verificationCode)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message : "Failed to send verification email. Please try again later."
            }, {status: 500})
        }

        // at last when the user is registered and the verification email is sent successfully then we will send the response to the frontend
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please check your email to verify your account."
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.log("Error in the registering user ", error);
        return Response.json(
            {
                success: false,
                message: "Failed to register user."
            },
            {
                status: 500
            }
        )
    }
}