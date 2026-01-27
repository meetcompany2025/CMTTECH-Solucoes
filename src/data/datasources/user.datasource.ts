/**
 * User DataSource - API calls for user management
 */

import { httpClient, transformAxiosError } from '@/infrastructure/http/http-client';
import { UserResponseDTO, UserUpdateDTO } from '../dto/user.dto';

export class UserDataSource {
    /**
     * Get user by ID
     * GET /users/{id}
     */
    async getUser(id: string): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.get<UserResponseDTO>(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Update user
     * PUT /users/{id}
     */
    async updateUser(id: string, data: UserUpdateDTO): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.put<UserResponseDTO>(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Delete user
     * DELETE /users/{id}
     */
    async deleteUser(id: string): Promise<void> {
        try {
            await httpClient.delete(`/users/${id}`);
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Update user preferences
     * PATCH /users/{id}/preferences
     */
    async updatePreferences(id: string, preferences: Record<string, any>): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.patch<UserResponseDTO>(`/users/${id}/preferences`, {
                preferences,
            });
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Get current user
     * GET /users/me
     */
    async getMe(): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.get<UserResponseDTO>(`/users/me`);
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Upload user avatar
     * PATCH /users/{id}/avatar
     */
    async uploadAvatar(id: string, file: File): Promise<{ avatar_url: string }> {
        try {
            const formData = new FormData();
            formData.append('avatar_image', file);

            const response = await httpClient.patch<{ avatar_url: string }>(`/users/${id}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }

    /**
     * Deactivate user
     * POST /users/{id}/deactivate
     */
    async deactivateUser(id: string): Promise<UserResponseDTO> {
        try {
            const response = await httpClient.post<UserResponseDTO>(`/users/${id}/deactivate`);
            return response.data;
        } catch (error) {
            throw transformAxiosError(error);
        }
    }
}
