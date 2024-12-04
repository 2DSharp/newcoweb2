import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    // Get cookies from the request object
    const cookieStore = cookies();

    // Retrieve the refresh token using the get method
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.json(
            { message: 'No refresh token found' },
            { status: 404 }
        );
    }

    return NextResponse.json({ refreshToken });
}
