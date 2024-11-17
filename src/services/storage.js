import { serialize } from 'cookie';

// export default function storeRefreshToken(refreshToken){
//     // Serialize the cookie
//     const cookie = serialize('refreshToken', refreshToken, {
//         httpOnly: true, // Makes the cookie inaccessible via JavaScript
//         secure: process.env.NODE_ENV === 'production', // Only use HTTPS in production
//         maxAge: 60 * 60 * 24 * 30, // 30 days expiration
//         path: '/', // Cookie is available across the whole site
//         sameSite: 'strict', // Prevents CSRF attacks
//     });
//
//     res.setHeader('Set-Cookie', cookie);
//
// }
//
// export default function storeTempCredentials(accessToken, userId, loginType, expiry) {
//     localStorage.setItem("accessToken", accessToken)
//     localStorage.setItem("userId", userId);
//     localStorage.setItem("loginType", loginType);
//     localStorage.setItem("expiry", expiry);
// }

export default storeCredentials