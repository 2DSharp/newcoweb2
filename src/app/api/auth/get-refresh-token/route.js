import {NextResponse} from "next/server";
export async function GET(request) {

    // Get cookies from the request object
    const cookies = request.cookies;

    // Retrieve the refresh token using the get method
    const refreshToken = cookies.get('refreshToken')?.value;

    if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token found' },
            {status: 404});
    }

    return NextResponse.json({ refreshToken });
}
