import { httpClient } from '@/infrastructure/http/http-client';
import { EmailNotificationResponseDTO, NotificationMapper, TestEmailRequestDTO } from '../dto/notification.dto';
import { EmailNotification, TestEmailRequest } from '@/domain/entities/notification.entity';

export class NotificationDataSource {
    private readonly systemPath = '/system/notifications';
    private readonly emailsPath = '/emails';

    async getAll(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]> {
        const response = await httpClient.get<EmailNotificationResponseDTO[]>(this.systemPath, {
            params: {
                skip: params?.skip || 0,
                limit: params?.limit || 50,
            },
        });
        return response.data.map(dto => NotificationMapper.toDomain(dto));
    }

    async getPending(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]> {
        const response = await httpClient.get<EmailNotificationResponseDTO[]>(`${this.emailsPath}/notifications/pending`, {
            params: {
                skip: params?.skip || 0,
                limit: params?.limit || 10,
            },
        });
        return response.data.map(dto => NotificationMapper.toDomain(dto));
    }

    async retry(notificationId: string): Promise<void> {
        await httpClient.post(`${this.emailsPath}/notifications/${notificationId}/retry`);
    }

    async sendTestEmail(data: TestEmailRequest): Promise<{ message: string }> {
        const dto = NotificationMapper.toTestEmailDTO(data);
        const response = await httpClient.post<{ message: string }>(`${this.emailsPath}/test-email`, dto);
        return response.data;
    }
}
