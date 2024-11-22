'use client';

import React, { useEffect, useRef } from 'react';
import apiService from '@/services/api';

const REFRESH_INTERVAL = 300000; // 5 minutes in milliseconds

export function AuthRefreshProvider({ children }: { children: React.ReactNode }) {
    const isRefreshing = useRef(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const refreshToken = async () => {
            // If already refreshing, skip this attempt
            if (isRefreshing.current) {
                console.log('Refresh already in progress, skipping');
                return;
            }

            try {
                isRefreshing.current = true;
                // Get refresh token from HTTP-only cookie via Next.js API
                const refreshTokenResponse = await fetch('/api/auth/get-refresh-token');
                const { refreshToken } = await refreshTokenResponse.json();

                if (!refreshToken) {
                    console.log('No refresh token found');
                    return;
                }

                // Call backend refresh token endpoint
                const response = await apiService.auth.refreshToken({ refreshToken });
                const { accessToken, userId, loginType, newRefreshToken } = response.data;

                // Store new refresh token in HTTP-only cookie
                await fetch('/api/auth/set-refresh-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: newRefreshToken }),
                });

                // Update localStorage with new access token and user info
                localStorage.setItem('auth_data', JSON.stringify({
                    accessToken,
                    userId,
                    loginType
                }));

            } catch (error) {
                console.error('Token refresh failed:', error);
                localStorage.clear();
                window.location.href = '/';
            } finally {
                isRefreshing.current = false;
            }
        };

        const checkAuthAndStartInterval = () => {
            const authData = localStorage.getItem('auth_data');
            if (authData) {
                refreshToken(); // Initial refresh
                intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
            }
        };

        checkAuthAndStartInterval();

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    return <>{children}</>;
} 