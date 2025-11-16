import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
} from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({
    username = 'User',
    otp = '123456',
}: VerificationEmailProps) {
    return (
        <Html>
            <Head>
                <title>Verification Code</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Arial"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Your verification code: {otp}</Preview>
            <Section style={container}>
                <Heading style={heading}>Verification Code</Heading>
                <Text style={paragraph}>Hello {username},</Text>
                <Text style={paragraph}>
                    Thank you for signing up. Please use the verification code below to complete your registration:
                </Text>
                <Section style={otpContainer}>
                    <Text style={otpText}>{otp}</Text>
                </Section>
                <Text style={paragraph}>
                    This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                </Text>
                <Row style={{ marginTop: '20px' }}>
                    <Button
                        style={{
                            ...button,
                            padding: '12px 20px', // Replace pX and pY with padding
                        }}
                        href="https://yourwebsite.com/verify"
                    >
                        Verify Account
                    </Button>
                </Row>
                <Text style={footer}>
                    If you have any questions, please contact our support team.
                </Text>
            </Section>
        </Html>
    );
}

// Styles
const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
};

const heading = {
    fontSize: '24px',
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold',
    marginBottom: '24px',
};

const paragraph = {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.5',
    color: '#3c4043',
};

const otpContainer = {
    padding: '24px 0',
    textAlign: 'center' as const,
};

const otpText = {
    fontSize: '36px',
    fontFamily: 'Roboto, Arial, sans-serif',
    fontWeight: 'bold',
    letterSpacing: '6px',
    color: '#1a73e8',
};

const button = {
    backgroundColor: '#1a73e8',
    borderRadius: '4px',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Roboto, Arial, sans-serif',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
};

const footer = {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#8c8c8c',
    marginTop: '32px',
};