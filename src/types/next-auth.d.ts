import 'next-auth';
//this is to extend the default types provided by next-auth to include custom properties in User, Session, and JWT objects.
//this is useful for type checking and ensuring that the custom properties are recognized throughout the application when using next-auth for authentication.
//it will be used to add custom fields like _id, isVerified, isAcceptingMessages, and username to the User, Session, and JWT interfaces in next-auth.
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id?: string;
            user: User;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        } & DefaultSession['user'];
    } 
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}