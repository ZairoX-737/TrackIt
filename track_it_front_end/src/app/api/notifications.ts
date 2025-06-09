import $api from './http';

export interface Notification {
	id: string;
	message: string;
	type: string;
	isRead: boolean;
	createdAt: string;
	entityId?: string;
	entityType?: string;
	triggeredByUser?: {
		id: string;
		username: string;
	};
}

export interface NotificationResponse {
	notifications: Notification[];
	total: number;
}

export interface UnreadCountResponse {
	count: number;
}

export class NotificationAPI {
	// Получить все уведомления
	static async getNotifications(
		projectId?: string,
		unreadOnly: boolean = false,
		page: number = 1,
		limit: number = 20
	): Promise<NotificationResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
		});

		if (projectId) {
			params.append('projectId', projectId);
		}

		if (unreadOnly) {
			params.append('unreadOnly', 'true');
		}
		const response = await $api.get(`/notifications?${params.toString()}`);
		return response.data;
	}

	// Получить количество непрочитанных уведомлений
	static async getUnreadCount(
		projectId?: string
	): Promise<UnreadCountResponse> {
		const params = new URLSearchParams();

		if (projectId) {
			params.append('projectId', projectId);
		}

		const response = await $api.get(
			`/notifications/count?${params.toString()}`
		);
		return response.data;
	}

	// Пометить уведомление как прочитанное
	static async markAsRead(notificationId: string): Promise<void> {
		await $api.put(`/notifications/${notificationId}/read`);
	}

	// Пометить все уведомления как прочитанные
	static async markAllAsRead(projectId?: string): Promise<void> {
		const params = new URLSearchParams();

		if (projectId) {
			params.append('projectId', projectId);
		}

		await $api.put(`/notifications/read-all?${params.toString()}`);
	}

	// Удалить уведомление
	static async deleteNotification(notificationId: string): Promise<void> {
		await $api.delete(`/notifications/${notificationId}`);
	}

	// Удалить все уведомления
	static async deleteAllNotifications(projectId?: string): Promise<void> {
		const params = new URLSearchParams();

		if (projectId) {
			params.append('projectId', projectId);
		}

		await $api.delete(`/notifications?${params.toString()}`);
	}
}
