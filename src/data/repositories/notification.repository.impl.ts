import { NotificationDataSource } from '../datasources/notification.datasource';
import { EmailNotification, TestEmailRequest } from '@/domain/entities/notification.entity';

export interface INotificationRepository {
    getAll(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]>;
    getPending(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]>;
    retry(notificationId: string): Promise<void>;
    sendTestEmail(data: TestEmailRequest): Promise<{ message: string }>;
}

export class NotificationRepository implements INotificationRepository {
    private dataSource: NotificationDataSource;

    constructor() {
        this.dataSource = new NotificationDataSource();
    }

    async getAll(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]> {
        return this.dataSource.getAll(params);
    }

    async getPending(params?: { skip?: number; limit?: number }): Promise<EmailNotification[]> {
        return this.dataSource.getPending(params);
    }

    async retry(notificationId: string): Promise<void> {
        return this.dataSource.retry(notificationId);
    }

    async sendTestEmail(data: TestEmailRequest): Promise<{ message: string }> {
        return this.dataSource.sendTestEmail(data);
    }
}
