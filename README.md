# Anonymous Messaging System

A full-stack anonymous messaging application built with Next.js, featuring user authentication, email verification, and AI-powered message suggestions.

## 🚀 Features

- **User Authentication**: Secure signup and signin with NextAuth.js
- **Email Verification**: Email-based account verification with OTP codes
- **Anonymous Messaging**: Send and receive anonymous messages
- **Message Management**: Users can toggle accepting messages on/off
- **AI-Powered Suggestions**: OpenAI integration for message suggestions
- **Real-time Validation**: Zod schema validation for forms
- **Responsive Design**: Built with Tailwind CSS
- **MongoDB Integration**: Secure data storage with Mongoose

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript 5** - Type safety and better developer experience

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4.24.13** - Authentication framework
- **MongoDB** - NoSQL database
- **Mongoose 8.18.0** - MongoDB object modeling

### Email & AI
- **React Email** - Email template components
- **Resend** - Email delivery service
- **OpenAI SDK** - AI-powered message suggestions

### Validation & Security
- **Zod 4.1.12** - Runtime type validation
- **bcryptjs** - Password hashing
- **ESLint** - Code linting

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── sign-in/          # Authentication pages
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth configuration
│   │   ├── signUp/          # User registration
│   │   ├── verify-code/     # Email verification
│   │   ├── send-messages/   # Message sending
│   │   ├── get-messages/    # Message retrieval
│   │   └── suggest-message/ # AI message suggestions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── context/
│   └── AuthProvider.tsx     # Authentication context
├── helpers/
│   └── sendVerificationEmail.ts # Email utilities
├── lib/
│   ├── dbConnect.ts         # MongoDB connection
│   └── resend.ts            # Email service configuration
├── model/
│   └── user.ts              # User and Message schemas
├── Schemas/
│   ├── signUpSchema.ts      # Registration validation
│   ├── signInSchema.ts      # Login validation
│   ├── verifySchema.ts      # OTP validation
│   ├── messageSchema.ts     # Message validation
│   └── acceptMessageSchema.ts # Message settings validation
├── types/
│   ├── ApiResponse.ts       # API response types
│   └── next-auth.d.ts       # NextAuth type extensions
└── middleware.ts            # Route protection middleware

emails/
└── verificationEmail.tsx    # Email templates
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Resend account (for email service)
- OpenAI API key (for AI suggestions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishal-RAJ-DEV/next-JS-backend-form.git
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Email Service (Resend)
   RESEND_API_KEY=your_resend_api_key
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

```bash
npm run dev        # Start development server with Turbopack
npm run build      # Build for production with Turbopack
npm start          # Start production server
npm run lint       # Run ESLint
```

## 📝 API Endpoints

### Authentication
- `POST /api/signUp` - User registration with email verification
- `POST /api/verify-code` - Verify email with OTP code
- `POST /api/auth/signin` - User login

### Messages
- `POST /api/send-messages` - Send anonymous message to user
- `GET /api/get-messages` - Retrieve user's messages
- `POST /api/suggest-message` - Get AI-generated message suggestions

### Utilities
- `GET /api/check-username-unique` - Check username availability
- `POST /api/accept-messages` - Toggle message acceptance settings

## 🔐 Authentication Flow

1. **User Registration**: User provides username, email, and password
2. **Email Verification**: 6-digit OTP sent via email using React Email templates
3. **Account Activation**: User verifies email to activate account
4. **Login**: Secure authentication with NextAuth.js and bcrypt password hashing

## 📧 Email System

The application uses **React Email** for templating and **Resend** for delivery:
- Professional verification email templates
- Responsive design for all devices
- Reliable delivery with Resend service

## 🤖 AI Integration

**OpenAI Integration** provides:
- Smart message suggestions based on context
- Streaming responses for better UX
- Customizable prompts for different scenarios

## 🛡️ Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Zod schemas for runtime validation
- **Route Protection**: Middleware-based authentication
- **CORS Protection**: Secure API endpoint configuration
- **Environment Variables**: Sensitive data protection

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication library
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Resend](https://resend.com/) - Email delivery service
- [OpenAI](https://openai.com/) - AI message suggestions
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For support, email your-email@example.com or create an issue in the GitHub repository.

---

Built with ❤️ using Next.js and modern web technologies.
