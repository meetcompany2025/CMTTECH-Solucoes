/**
 * Auth Repository Implementation
 */

import { IAuthRepository } from '@/domain/repositories/auth.repository.interface';
import { LoginCredentials, RegisterData, TokenResponse } from '@/domain/entities/auth.entity';
import { User } from '@/domain/entities/user.entity';
import { AuthDataSource } from '../datasources/auth.datasource';
import { toTokenResponse, toLoginRequestDTO } from '../dto/auth.dto';
import { toUser, toUserCreateDTO } from '../dto/user.dto';
import { TokenStorage } from '@/infrastructure/storage/token-storage';

export class AuthRepository implements IAuthRepository {
    private dataSource: AuthDataSource;

    constructor() {
        this.dataSource = new AuthDataSource();
    }

    async register(data: RegisterData): Promise<User> {
        const dto = toUserCreateDTO(data);
        const response = await this.dataSource.register(dto);
        return toUser(response);
    }

    async login(credentials: LoginCredentials): Promise<TokenResponse> {
        const loginDto = toLoginRequestDTO(credentials);
        const response = await this.dataSource.login(loginDto);
        const tokenResponse = toTokenResponse(response);

        // Store the access token
        TokenStorage.setAccessToken(tokenResponse.access_token);

        return tokenResponse;
    }

    async logout(): Promise<void> {
        // Clear tokens from storage
        TokenStorage.clearTokens();
    }

    async getCurrentUser(): Promise<User> {
        const response = await this.dataSource.getCurrentUser();
        return toUser(response);
    }

    async forgotPassword(email: string): Promise<void> {
        await this.dataSource.forgotPassword({ email });
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        await this.dataSource.resetPassword({ token, new_password: newPassword });
    }
}
