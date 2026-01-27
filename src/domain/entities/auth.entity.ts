/**
 * Auth Entity - Domain models for authentication
 */

import { User } from './user.entity';

export interface TokenResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    username: string;  // Can be email or username
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    avatar_url?: string | null;
    role?: string;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    new_password: string;
}
