/**
 * User DTOs - Data Transfer Objects for API communication
 */

import { User, UserCreate, UserUpdate } from '@/domain/entities/user.entity';

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserCreateDTO {
    username: string;
    email: string;
    password: string;
    avatar_url?: string | null;
    role?: string;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

export interface UserUpdateDTO {
    username?: string | null;
    email?: string | null;
    password?: string | null;
    role?: string | null;
    preferences?: Record<string, any> | null;
    interests?: Record<string, any> | null;
}

/**
 * Mapper: DTO to Domain Entity
 */
export function toUser(dto: UserResponseDTO): User {
    return {
        id: dto.id,
        username: dto.username,
        email: dto.email,
        role: dto.role,
        avatar_url: dto.avatar_url,
        preferences: dto.preferences,
        interests: dto.interests,
    };
}

/**
 * Mapper: Domain Entity to Create DTO
 */
export function toUserCreateDTO(data: UserCreate): UserCreateDTO {
    return {
        username: data.username,
        email: data.email,
        password: data.password,
        avatar_url: data.avatar_url,
        role: data.role,
        preferences: data.preferences,
        interests: data.interests,
    };
}

/**
 * Mapper: Domain Entity to Update DTO
 */
export function toUserUpdateDTO(data: UserUpdate): UserUpdateDTO {
    return {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        preferences: data.preferences,
        interests: data.interests,
    };
}
