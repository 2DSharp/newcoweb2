import { AuthResponse, TokenPayload, RefreshTokenRequest } from '@/types/auth.types';
import apiService from "@/services/api";

export class AuthService {
    private static instance: AuthService;
    private readonly BUYER_STORAGE_KEY = 'buyer_data';
    private readonly SELLER_STORAGE_KEY = 'seller_data';

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private getStorageKey(loginType: string): string {
        return loginType === 'BUYER' ? this.BUYER_STORAGE_KEY : this.SELLER_STORAGE_KEY;
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
        const storageKey = this.getStorageKey(response.loginType);

        // Store other data (except refresh token) in localStorage
        const payload: TokenPayload = {
            accessToken: response.accessToken,
            userId: response.userId,
            loginType: response.loginType,
            expiresAt: expiresAt
        };

        localStorage.setItem(storageKey, JSON.stringify(payload));
    }

    async refreshTokens(): Promise<boolean> {
        try {
            // Try to get both buyer and seller data
            const buyerData = this.getBuyerData();
            const sellerData = this.getSellerData();
            
            if (!buyerData && !sellerData) {
                console.error('No auth data found');
                return false;
            }

            // Get refresh token from cookie by making a request to Next.js API
            const tokenResponse = await fetch('/api/auth/get-refresh-token');
            const { refreshToken } = await tokenResponse.json();

            // Use the active session data
            const activeData = buyerData || sellerData;
            const refreshTokenRequest: RefreshTokenRequest = {
                userId: activeData.userId,
                loginType: activeData.loginType,
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

    getBuyerData(): TokenPayload | null {
        return this.getAuthDataByType('BUYER');
    }

    getSellerData(): TokenPayload | null {
        return this.getAuthDataByType('SELLER');
    }

    private getAuthDataByType(loginType: string): TokenPayload | null {
        const storageKey = this.getStorageKey(loginType);
        const data = localStorage.getItem(storageKey);
        if (!data) return null;
        try {
            const parsed = JSON.parse(data) as TokenPayload;
            return parsed;
        } catch {
            return null;
        }
    }

    isTokenExpired(loginType: string): boolean {
        const authData = this.getAuthDataByType(loginType);
        if (!authData) return true;
        return Date.now() >= authData.expiresAt;
    }

    clearAuth(loginType?: string): void {
        if (loginType) {
            // Clear specific auth type
            const storageKey = this.getStorageKey(loginType);
            localStorage.removeItem(storageKey);
        } else {
            // Clear all auth data
            localStorage.removeItem(this.BUYER_STORAGE_KEY);
            localStorage.removeItem(this.SELLER_STORAGE_KEY);
        }
        
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