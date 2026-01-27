import { SystemSettingDataSource } from '../datasources/setting.datasource';
import { SystemSetting, SystemSettingUpdate } from '@/domain/entities/setting.entity';

export interface ISystemSettingRepository {
    getAll(): Promise<SystemSetting[]>;
    update(key: string, data: SystemSettingUpdate): Promise<SystemSetting>;
}

export class SystemSettingRepository implements ISystemSettingRepository {
    private dataSource: SystemSettingDataSource;

    constructor() {
        this.dataSource = new SystemSettingDataSource();
    }

    async getAll(): Promise<SystemSetting[]> {
        return this.dataSource.getAll();
    }

    async update(key: string, data: SystemSettingUpdate): Promise<SystemSetting> {
        return this.dataSource.update(key, data);
    }
}
