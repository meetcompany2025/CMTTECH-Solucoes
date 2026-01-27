import { User, UserUpdate } from '@/domain/entities/user.entity';

export interface IUserRepository {
    getUser(id: string): Promise<User>;
    getMe(): Promise<User>;
    updateUser(id: string, data: UserUpdate): Promise<User>;
    updatePreferences(id: string, preferences: Record<string, any>): Promise<User>;
    uploadAvatar(id: string, file: File): Promise<{ avatar_url: string }>;
    deleteUser(id: string): Promise<void>;
    deactivateUser(id: string): Promise<User>;
}
