import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export enum NotificationType {
	TASK_CREATED = 'TASK_CREATED',
	TASK_UPDATED = 'TASK_UPDATED',
	TASK_DELETED = 'TASK_DELETED',
	COMMENT_CREATED = 'COMMENT_CREATED',
	BOARD_CREATED = 'BOARD_CREATED',
	BOARD_UPDATED = 'BOARD_UPDATED',
	BOARD_DELETED = 'BOARD_DELETED',
	COLUMN_CREATED = 'COLUMN_CREATED',
	COLUMN_UPDATED = 'COLUMN_UPDATED',
	COLUMN_DELETED = 'COLUMN_DELETED',
	USER_JOINED_PROJECT = 'USER_JOINED_PROJECT',
	USER_LEFT_PROJECT = 'USER_LEFT_PROJECT',
	LABEL_CREATED = 'LABEL_CREATED',
	LABEL_UPDATED = 'LABEL_UPDATED',
	LABEL_DELETED = 'LABEL_DELETED',
}

export interface CreateNotificationDto {
	message: string;
	type: NotificationType;
	userId: string;
	projectId: string;
	entityId?: string;
	entityType?: string;
	triggeredBy?: string;
}

@Injectable()
export class NotificationService {
	private logger = new Logger(NotificationService.name);

	constructor(private prisma: PrismaService) {}

	async createNotification(data: CreateNotificationDto) {
		this.logger.log(
			`Creating notification for user ${data.userId} in project ${data.projectId}`
		);

		const notification = await this.prisma.notification.create({
			data: {
				message: data.message,
				type: data.type as any,
				userId: data.userId,
				projectId: data.projectId,
				entityId: data.entityId,
				entityType: data.entityType,
				triggeredBy: data.triggeredBy,
			},
			include: {
				triggeredByUser: true,
			},
		});

		return notification;
	}

	async createNotificationForProjectUsers(
		projectId: string,
		data: Omit<CreateNotificationDto, 'userId' | 'projectId'>,
		excludeUserId?: string
	) {
		this.logger.log(
			`Creating notifications for all users in project ${projectId}`
		);

		// Получаем всех пользователей проекта
		const projectUsers = await this.prisma.userOnProject.findMany({
			where: {
				projectId,
				...(excludeUserId && {
					userId: {
						not: excludeUserId,
					},
				}),
			},
			select: {
				userId: true,
			},
		});

		// Создаем уведомления для всех пользователей
		const notifications = await Promise.all(
			projectUsers.map(userProject =>
				this.createNotification({
					...data,
					userId: userProject.userId,
					projectId,
				})
			)
		);

		return notifications;
	}

	async getUnreadNotifications(userId: string, projectId?: string) {
		const where: any = {
			userId,
			isRead: false,
		};

		if (projectId) {
			where.projectId = projectId;
		}

		return this.prisma.notification.findMany({
			where,
			include: {
				triggeredByUser: {
					select: {
						id: true,
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	async getAllNotifications(userId: string, projectId?: string) {
		const where: any = {
			userId,
		};

		if (projectId) {
			where.projectId = projectId;
		}

		return this.prisma.notification.findMany({
			where,
			include: {
				triggeredByUser: {
					select: {
						id: true,
						username: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}
	async markAsRead(notificationId: string) {
		try {
			return await this.prisma.notification.update({
				where: { id: notificationId },
				data: { isRead: true },
				include: {
					triggeredByUser: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			});
		} catch (error) {
			// Если уведомление не найдено, возвращаем null
			if (error.code === 'P2025') {
				return null;
			}
			throw error;
		}
	}

	async markAllAsRead(userId: string, projectId?: string) {
		const where: any = {
			userId,
			isRead: false,
		};

		if (projectId) {
			where.projectId = projectId;
		}

		const result = await this.prisma.notification.updateMany({
			where,
			data: { isRead: true },
		});

		return { count: result.count };
	}

	async getUnreadCount(userId: string, projectId?: string): Promise<number> {
		const where: any = {
			userId,
			isRead: false,
		};

		if (projectId) {
			where.projectId = projectId;
		}

		return this.prisma.notification.count({ where });
	}

	async deleteNotification(notificationId: string) {
		return this.prisma.notification.delete({
			where: { id: notificationId },
		});
	}

	async deleteAllNotifications(userId: string, projectId?: string) {
		const where: any = {
			userId,
		};

		if (projectId) {
			where.projectId = projectId;
		}

		const result = await this.prisma.notification.deleteMany({ where });
		return { count: result.count };
	}
}
