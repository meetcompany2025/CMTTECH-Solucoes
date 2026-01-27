import { httpClient } from '@/infrastructure/http/http-client';
import { SystemSettingResponseDTO, SystemSettingUpdateDTO, SystemSettingMapper } from '../dto/setting.dto';
import { SystemSetting, SystemSettingUpdate } from '@/domain/entities/setting.entity';

export class SystemSettingDataSource {
    private readonly basePath = '/system/settings';

    async getAll(): Promise<SystemSetting[]> {
        const response = await httpClient.get<SystemSettingResponseDTO[]>(this.basePath);
        return response.data.map(dto => SystemSettingMapper.toDomain(dto));
    }

    async update(key: string, data: SystemSettingUpdate): Promise<SystemSetting> {
        const dto = SystemSettingMapper.toUpdateDTO(data);
        // Assuming PUT /system/settings/{key}
        const response = await httpClient.put<SystemSettingResponseDTO>(`${this.basePath}/${key}`, dto);
        return SystemSettingMapper.toDomain(response.data);
    }
}
