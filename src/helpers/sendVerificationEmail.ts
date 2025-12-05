import resend from "@/lib/resend"
import VerificationEmail from "../../emails/verficationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {
        // Add detailed logging for debugging
        console.log('📧 Starting email send process...');
        console.log('📧 Recipient:', email);
        console.log('📧 Username:', username);
        console.log('📧 Verification Code:', verifyCode);
        console.log('📧 API Key exists:', !!process.env.RESEND_API_KEY);

        // Check if API key is available
        if (!process.env.RESEND_API_KEY) {
            console.error('❌ RESEND_API_KEY is not set in environment variables');
            return {
                success: false,
                message: "Email service not configured. Please contact administrator."
            };
        }

        // Validate email format before sending
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('❌ Invalid email format:', email);
            return {
                success: false,
                message: "Invalid email format provided."
            };
        }

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // This is Resend's default sender for testing
            to: email, // Use string format instead of array
            subject: 'Verify Your Account - MessageApp',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        // Check for Resend API errors
        if (error) {
            console.error('❌ Resend API Error:', error);
            return {
                success: false,
                message: `Email service error: ${error.message}`
            };
        }

        console.log('✅ Email sent successfully:', data);
        return {
            success: true,
            message: "Verification email sent successfully."
        };

    } catch (emailError: any) {
        console.error("❌ Unexpected error sending verification email:", emailError);
        
        // More detailed error logging
        if (emailError.response) {
            console.error('❌ Response data:', emailError.response.data);
            console.error('❌ Response status:', emailError.response.status);
        }
        
        return {
            success: false,
            message: `Failed to send verification email: ${emailError.message || 'Unknown error'}`
        };
    }
}


