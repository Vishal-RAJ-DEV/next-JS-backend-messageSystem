import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user";
import dbConnect from "@/lib/dbConnect";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email }, //here credentials.email is the email or username entered by the user that allows user to login with either email or username by searching in database
                            { username: credentials.email } //allowing user to login with either email or username
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found with the provided identifier");
                    }
                    if (!user.isVerified) {
                        throw new Error("User is not verified. Please verify your email before signing in.");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password); //comparing the entered password with the hashed password stored in the database
                    if (isPasswordValid) {
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }

                } catch (error: any) {
                    throw new Error("Error connecting to the database");
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token , user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified ;
                token.isAcceptingMessages = user.isAcceptingMessages ;
                token.username = user.username ;
            } return token;
        },
        async session({session , token}) { //in further this session used to get the session of the user and check if the user is verified or not
            if(token){
                session.user._id = token._id ;
                session.user.isVerified = token.isVerified ;
                session.user.isAcceptingMessages = token.isAcceptingMessages ;
                session.user.username = token.username ;
            }
            return session 
        }
    },
    pages :{
        signIn : '/auth/sign-in',
    },
    session : {
        strategy : 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,

}