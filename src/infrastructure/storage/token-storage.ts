/**
 * Token Storage - Handles persistent storage of authentication tokens
 */

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const TokenStorage = {
    /**
     * Store access token in localStorage
     */
    setAccessToken(token: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    /**
     * Retrieve access token from localStorage
     */
    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    /**
     * Store refresh token in localStorage
     */
    setRefreshToken(token: string): void {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    },

    /**
     * Retrieve refresh token from localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Clear all tokens from localStorage
     */
    clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    /**
     * Check if user has a valid access token
     */
    hasAccessToken(): boolean {
        return !!this.getAccessToken();
    },
};
