export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
    loginType: string;
    expiry: string;
}

export interface TokenPayload {
    accessToken: string;
    userId: string;
    loginType: string;
    expiresAt: number;
}

export interface RefreshTokenRequest {
    userId: string;
    loginType: string;
    token: string;  // refresh token
}