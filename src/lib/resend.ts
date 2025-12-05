import { Resend } from "resend";

// Validate API key before creating Resend instance
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.error('❌ RESEND_API_KEY environment variable is not set');
    console.log('📝 Please add RESEND_API_KEY to your .env.local file');
    // Don't throw error here to avoid breaking the build
}

const resend = new Resend(apiKey);

export default resend;
