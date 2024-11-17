import { AuthResponse, TokenPayload, RefreshTokenRequest } from '@/types/auth.types';
import apiService from "@/services/api";

export class AuthService {
    private static instance: AuthService;
    private readonly STORAGE_KEY = 'auth_data';

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async setAuthData(response: AuthResponse): Promise<void> {
        // Set refresh token in HTTP-only cookie
        await fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: response.refreshToken }),
        });

        const expiresAt = new Date(response.expiry).getTime();

        // Store other data (except refresh token) in localStorage
        const payload: TokenPayload = {
            accessToken: response.accessToken,
            userId: response.userId,
            loginType: response.loginType,
            expiresAt: expiresAt
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    }

    async refreshTokens(): Promise<boolean> {
        try {
            const authData = this.getAuthData();
            if (!authData) {
                console.error('No Auth data found');
                return false;
            }

            // Get refresh token from cookie by making a request to Next.js API
            const tokenResponse = await fetch('/api/auth/get-refresh-token');
            const { refreshToken } = await tokenResponse.json();

            const refreshTokenRequest: RefreshTokenRequest = {
                userId: authData.userId,
                loginType: authData.loginType,
                token: refreshToken
            };

            // Use apiService to refresh token and get response data directly
            const data: AuthResponse = await apiService.auth.refreshToken(refreshTokenRequest);

            // If we got here, the refresh was successful
            await this.setAuthData(data);
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }

    getAuthData(): TokenPayload | null {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (!data) return null;
        try {
            const parsed = JSON.parse(data) as TokenPayload;
            return parsed;
        } catch {
            return null;
        }
    }

    isTokenExpired(): boolean {
        const authData = this.getAuthData();
        if (!authData) return true;
        return Date.now() >= authData.expiresAt;
    }

    clearAuth(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        // Clear refresh token cookie
        fetch('/api/auth/set-refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: '' }),
        });
    }
}