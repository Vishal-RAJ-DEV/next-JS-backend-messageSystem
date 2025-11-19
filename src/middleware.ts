import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'


export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    //this middleware function is responsible for redirecting users based on their authentication status
    //if user is login and have the token then redirect them away from auth pages to the home page
    // Redirect authenticated users away from auth pages
    if (token &&
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Let the root page load normally
    if (url.pathname === '/') {
        return NextResponse.next()
    }

    return NextResponse.next()
}

// Supports both a single string value or an array of matchers 
//these are the paths where the middleware will be applied and check for authentication
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/verify/:path*'
    ],
}