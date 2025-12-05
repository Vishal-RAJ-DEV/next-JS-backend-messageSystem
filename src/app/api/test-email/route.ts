import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        
        console.log('🧪 Testing email send to:', email);
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({
                success: false,
                message: "Invalid email format"
            }, { status: 400 });
        }

        const result = await sendVerificationEmail(
            email.trim().toLowerCase(), // Clean the email
            "TestUser",
            "123456"
        );
        
        return Response.json(result);
        
    } catch (error) {
        console.error('🧪 Test email error:', error);
        return Response.json({
            success: false,
            message: "Test failed"
        }, { status: 500 });
    }
}