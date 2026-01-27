/**
 * User Entity - Domain model for user
 */

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserCreate {
    username: string;
    email: string;
    password: string;
    avatar_url?: string | null;
    role?: string;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserUpdate {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}
