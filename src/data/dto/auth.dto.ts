/**
 * Auth DTOs - Data Transfer Objects for authentication
 */

import { TokenResponse, RegisterData, LoginCredentials } from '@/domain/entities/auth.entity';
import { User } from '@/domain/entities/user.entity';
import { toUser, UserResponseDTO } from './user.dto';

export interface TokenResponseDTO {
    access_token: string;
    token_type: string;
    user: UserResponseDTO;
}

export interface LoginRequestDTO {
    username: string;
    password: string;
    grant_type?: string;
    scope?: string;
    client_id?: string;
    client_secret?: string;
}

export interface PasswordResetRequestDTO {
    email: string;
}

export interface PasswordResetConfirmDTO {
    token: string;
    new_password: string;
}

/**
 * Mapper: DTO to Domain Entity
 */
export function toTokenResponse(dto: TokenResponseDTO): TokenResponse {
    return {
        access_token: dto.access_token,
        token_type: dto.token_type,
        user: toUser(dto.user),
    };
}

/**
 * Mapper: Domain to Login Request DTO
 * Note: API expects OAuth2 form-urlencoded format
 */
export function toLoginRequestDTO(credentials: LoginCredentials): LoginRequestDTO {
    return {
        username: credentials.username,
        password: credentials.password,
    };
}
