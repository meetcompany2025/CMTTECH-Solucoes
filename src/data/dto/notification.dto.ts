import { EmailNotification, TestEmailRequest } from '@/domain/entities/notification.entity';

export interface EmailNotificationResponseDTO {
    id: string;
    destinatario_email: string;
    assunto: string;
    corpo_html: string;
    tipo: string;
    relacionado_tipo?: string | null;
    relacionado_id?: string | null;
    estado: string;
    tentativas: number;
    erro_mensagem?: string | null;
    enviado_at?: string | null;
    created_at?: string | null;
}

export interface TestEmailRequestDTO {
    to_email: string;
    to_name?: string;
}

export class NotificationMapper {
    static toDomain(dto: EmailNotificationResponseDTO): EmailNotification {
        return {
            id: dto.id,
            destinatario_email: dto.destinatario_email,
            assunto: dto.assunto,
            corpo_html: dto.corpo_html,
            tipo: dto.tipo,
            relacionado_tipo: dto.relacionado_tipo,
            relacionado_id: dto.relacionado_id,
            estado: dto.estado,
            tentativas: dto.tentativas,
            erro_mensagem: dto.erro_mensagem,
            enviado_at: dto.enviado_at,
            created_at: dto.created_at,
        };
    }

    static toTestEmailDTO(data: TestEmailRequest): TestEmailRequestDTO {
        return {
            to_email: data.to_email,
            to_name: data.to_name,
        };
    }
}
