/**
 * User Repository Implementation
 */

import { IUserRepository } from '@/domain/repositories/user.repository.interface';
import { User, UserUpdate } from '@/domain/entities/user.entity';
import { UserDataSource } from '../datasources/user.datasource';
import { toUser, toUserUpdateDTO } from '../dto/user.dto';

export class UserRepository implements IUserRepository {
    private dataSource: UserDataSource;

    constructor() {
        this.dataSource = new UserDataSource();
    }

    async getUser(id: string): Promise<User> {
        const response = await this.dataSource.getUser(id);
        return toUser(response);
    }

    async getMe(): Promise<User> {
        const response = await this.dataSource.getMe();
        return toUser(response);
    }

    async updateUser(id: string, data: UserUpdate): Promise<User> {
        const dto = toUserUpdateDTO(data);
        const response = await this.dataSource.updateUser(id, dto);
        return toUser(response);
    }

    async deleteUser(id: string): Promise<void> {
        await this.dataSource.deleteUser(id);
    }

    async updatePreferences(id: string, preferences: Record<string, any>): Promise<User> {
        const response = await this.dataSource.updatePreferences(id, preferences);
        return toUser(response);
    }

    async uploadAvatar(id: string, file: File): Promise<{ avatar_url: string }> {
        return await this.dataSource.uploadAvatar(id, file);
    }

    async deactivateUser(id: string): Promise<User> {
        const response = await this.dataSource.deactivateUser(id);
        return toUser(response);
    }
}
