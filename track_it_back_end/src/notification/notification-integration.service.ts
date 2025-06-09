import { Injectable } from '@nestjs/common';
import { NotificationService, NotificationType } from './notification.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationIntegrationService {
	constructor(
		private notificationService: NotificationService,
		private notificationGateway: NotificationGateway
	) {}
	async notifyTaskCreated(
		projectId: string,
		taskId: string,
		taskTitle: string,
		createdBy: string
	) {
		const message = `New task created: ${taskTitle}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.TASK_CREATED,
					entityId: taskId,
					entityType: 'task',
					triggeredBy: createdBy,
				},
				createdBy // исключаем создателя
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		// Обновляем счетчики уведомлений
		await this.updateNotificationCounts(projectId);
	}
	async notifyTaskUpdated(
		projectId: string,
		taskId: string,
		taskTitle: string,
		updatedBy: string
	) {
		const message = `Task updated: ${taskTitle}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.TASK_UPDATED,
					entityId: taskId,
					entityType: 'task',
					triggeredBy: updatedBy,
				},
				updatedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyTaskDeleted(
		projectId: string,
		taskTitle: string,
		deletedBy: string
	) {
		const message = `Task deleted: ${taskTitle}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.TASK_DELETED,
					entityType: 'task',
					triggeredBy: deletedBy,
				},
				deletedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyCommentCreated(
		projectId: string,
		taskId: string,
		commentId: string,
		taskTitle: string,
		createdBy: string
	) {
		const message = `Comment added to task: ${taskTitle}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.COMMENT_CREATED,
					entityId: commentId,
					entityType: 'comment',
					triggeredBy: createdBy,
				},
				createdBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyBoardCreated(
		projectId: string,
		boardId: string,
		boardName: string,
		createdBy: string
	) {
		const message = `New board created: ${boardName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.BOARD_CREATED,
					entityId: boardId,
					entityType: 'board',
					triggeredBy: createdBy,
				},
				createdBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyBoardUpdated(
		projectId: string,
		boardId: string,
		boardName: string,
		updatedBy: string
	) {
		const message = `Board updated: ${boardName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.BOARD_UPDATED,
					entityId: boardId,
					entityType: 'board',
					triggeredBy: updatedBy,
				},
				updatedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyBoardDeleted(
		projectId: string,
		boardName: string,
		deletedBy: string
	) {
		const message = `Board deleted: ${boardName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.BOARD_DELETED,
					entityType: 'board',
					triggeredBy: deletedBy,
				},
				deletedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyColumnCreated(
		projectId: string,
		columnId: string,
		columnName: string,
		createdBy: string
	) {
		const message = `New column created: ${columnName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.COLUMN_CREATED,
					entityId: columnId,
					entityType: 'column',
					triggeredBy: createdBy,
				},
				createdBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyColumnUpdated(
		projectId: string,
		columnId: string,
		columnName: string,
		updatedBy: string
	) {
		const message = `Column updated: ${columnName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.COLUMN_UPDATED,
					entityId: columnId,
					entityType: 'column',
					triggeredBy: updatedBy,
				},
				updatedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyColumnDeleted(
		projectId: string,
		columnName: string,
		deletedBy: string
	) {
		const message = `Column deleted: ${columnName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.COLUMN_DELETED,
					entityType: 'column',
					triggeredBy: deletedBy,
				},
				deletedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyUserJoinedProject(
		projectId: string,
		joinedUserId: string,
		joinedUsername: string
	) {
		const message = `${joinedUsername} joined the project`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.USER_JOINED_PROJECT,
					triggeredBy: joinedUserId,
				},
				joinedUserId
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}
		await this.updateNotificationCounts(projectId);
	}
	async notifyLabelCreated(
		projectId: string,
		labelId: string,
		labelName: string,
		createdBy: string
	) {
		const message = `New label created: ${labelName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.LABEL_CREATED,
					entityId: labelId,
					entityType: 'label',
					triggeredBy: createdBy,
				},
				createdBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyLabelUpdated(
		projectId: string,
		labelId: string,
		labelName: string,
		updatedBy: string
	) {
		const message = `Label updated: ${labelName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.LABEL_UPDATED,
					entityId: labelId,
					entityType: 'label',
					triggeredBy: updatedBy,
				},
				updatedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}
	async notifyLabelDeleted(
		projectId: string,
		labelName: string,
		deletedBy: string
	) {
		const message = `Label deleted: ${labelName}`;

		const notifications =
			await this.notificationService.createNotificationForProjectUsers(
				projectId,
				{
					message,
					type: NotificationType.LABEL_DELETED,
					entityType: 'label',
					triggeredBy: deletedBy,
				},
				deletedBy
			);

		// Отправляем персональные уведомления каждому пользователю
		for (const notification of notifications) {
			await this.notificationGateway.notifyUser(
				notification.userId,
				notification
			);
		}

		await this.updateNotificationCounts(projectId);
	}

	private async updateNotificationCounts(projectId: string) {
		// Получаем всех пользователей проекта и обновляем их счетчики
		const projectUsers = await this.notificationService[
			'prisma'
		].userOnProject.findMany({
			where: { projectId },
			select: { userId: true },
		});

		for (const userProject of projectUsers) {
			const count = await this.notificationService.getUnreadCount(
				userProject.userId,
				projectId
			);

			await this.notificationGateway.updateProjectNotificationCount(
				projectId,
				userProject.userId,
				count
			);
		}
	}
}
