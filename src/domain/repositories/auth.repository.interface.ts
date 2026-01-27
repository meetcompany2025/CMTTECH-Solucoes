/**
 * Auth Repository Interface - Contract for authentication operations
 */

import { LoginCredentials, RegisterData, TokenResponse } from '../entities/auth.entity';
import { User } from '../entities/user.entity';

export interface IAuthRepository {
    /**
     * Register a new user
     */
    register(data: RegisterData): Promise<User>;

    /**
     * Login with credentials
     */
    login(credentials: LoginCredentials): Promise<TokenResponse>;

    /**
     * Logout current user
     */
    logout(): Promise<void>;

    /**
     * Get current authenticated user
     */
    getCurrentUser(): Promise<User>;

    /**
     * Request password reset
     */
    forgotPassword(email: string): Promise<void>;

    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
}
