// pages/api/auth/route.js
import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function POST(request) {

    const { refreshToken } = await request.json();

    if (!refreshToken) {
        return NextResponse.json({ message: 'Refresh token is required' }, {status: 400});
    }

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: refreshToken ? 30 * 24 * 60 * 60 : 0, // 30 days if token exists, 0 to clear
        path: '/',
    };


    // Get the cookies instance
    const cookieStore = cookies();

    // Set the cookie
    cookieStore.set('refreshToken', refreshToken, cookieOptions);

    return NextResponse.json({ success: true });
}
