import resend from "@/lib/resend"
import VerificationEmail from "../../emails/verficationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> { //here the prommise is of type ApiResponse which is the interface we created in types folder
    try {

        //this will send the email using resend service
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'verificationCode',//this is will be the subject of the email
            react: VerificationEmail({ username, otp: verifyCode }),//this is the react component which will be rendered as the email body and show the username and otp
        });

        return {
            success: true,
            message: "Verification email sent successfully."
        };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}


