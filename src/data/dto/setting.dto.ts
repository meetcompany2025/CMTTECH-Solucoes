import { SystemSetting, SystemSettingUpdate } from '@/domain/entities/setting.entity';

export interface SystemSettingResponseDTO {
    id: string;
    chave: string;
    valor?: string | null;
    tipo: string;
    grupo: string;
    descricao?: string | null;
    editavel: boolean;
    updated_at?: string | null;
}

export interface SystemSettingUpdateDTO {
    valor?: string | null;
    descricao?: string | null;
}

export class SystemSettingMapper {
    static toDomain(dto: SystemSettingResponseDTO): SystemSetting {
        return {
            id: dto.id,
            chave: dto.chave,
            valor: dto.valor,
            tipo: dto.tipo,
            grupo: dto.grupo,
            descricao: dto.descricao,
            editavel: dto.editavel,
            updated_at: dto.updated_at,
        };
    }

    static toUpdateDTO(data: SystemSettingUpdate): SystemSettingUpdateDTO {
        return {
            valor: data.valor,
            descricao: data.descricao,
        };
    }
}
