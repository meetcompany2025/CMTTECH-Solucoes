/**
 * Auth DataSource - API calls for authentication
 */

import { httpClient, transformAxiosError } from '@/infrastructure/http/http-client';
import { UserResponseDTO, UserCreateDTO } from '../dto/user.dto';
import { TokenResponseDTO, LoginRequestDTO, PasswordResetRequestDTO, PasswordResetConfirmDTO } from '../dto/auth.dto';

export class AuthDataSource {
    /**
     * Register a new user
     * POST /users/register
     */
    async register(data: UserCreateDTO): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.post<UserResponseDTO>('/users/register', data);
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Login with credentials  
     * POST /users/login
     * Note: API expects OAuth2 form-urlencoded format
     */
    async login(credentials: LoginRequestDTO): Promise<TokenResponseDTO> {
        try {
            // Convert to form-urlencoded format
            const formData = new URLSearchParams();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);

            const response = await httpClient.post<TokenResponseDTO>('/users/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Get current authenticated user
     * GET /users/me
     */
    async getCurrentUser(): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.get<UserResponseDTO>('/users/me');
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Request password reset
     * POST /users/password/forgot
     */
    async forgotPassword(data: PasswordResetRequestDTO): Promise<void> {
        try {
            await httpClient.post('/users/password/forgot', data);
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Reset password with token
     * POST /users/password/reset
     */
    async resetPassword(data: PasswordResetConfirmDTO): Promise<void> {
        try {
            await httpClient.post('/users/password/reset', data);
        } catch (error) {
            throw transformAxiosError(error);
        }
    }
}
