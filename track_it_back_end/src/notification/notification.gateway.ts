import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';

interface AuthenticatedSocket extends Socket {
	userId?: string;
	projectId?: string;
}

@WebSocketGateway({
	cors: {
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
	},
	namespace: '/notifications',
})
export class NotificationGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('NotificationGateway');
	private projectConnections = new Map<string, Set<AuthenticatedSocket>>();
	private userConnections = new Map<string, Set<AuthenticatedSocket>>();
	constructor(
		private notificationService: NotificationService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}
	async handleConnection(client: AuthenticatedSocket) {
		try {
			const token = client.handshake?.auth?.token;
			this.logger.log(
				`Client connecting: ${client.id}, token: ${token ? 'present' : 'missing'}`
			);

			if (!token) {
				this.logger.error(`Client ${client.id} connection rejected: no token`);
				client.emit('error', { message: 'Authentication required' });
				client.disconnect();
				return;
			}

			// Проверяем токен с явным указанием секрета
			try {
				const jwtSecret = this.configService.get('JWT_SECRET');
				if (!jwtSecret) {
					this.logger.error('JWT_SECRET not found in configuration');
					client.emit('error', { message: 'Server configuration error' });
					client.disconnect();
					return;
				}
				const payload = this.jwtService.verify(token, { secret: jwtSecret });
				client.userId = payload.id; // Используем 'id' вместо 'sub'
				this.logger.log(
					`Client ${client.id} authenticated as user ${client.userId}`
				);
			} catch (error) {
				this.logger.error(
					`Client ${client.id} authentication failed: ${error.message}`
				);

				// Различаем типы ошибок токена
				if (error.message === 'jwt expired') {
					this.logger.log(
						`Token expired for client ${client.id}, sending tokenExpired event`
					);
					client.emit('tokenExpired', {
						message: 'Token expired, please reconnect with a new token',
					});
				} else {
					this.logger.log(
						`Invalid token for client ${client.id}, sending authError event`
					);
					client.emit('authError', { message: 'Invalid token' });
				}

				client.disconnect();
				return;
			}

			this.logger.log(
				`Client connected and authenticated: ${client.id} (user: ${client.userId})`
			);
		} catch (error) {
			this.logger.error('Error in handleConnection:', error);
			client.disconnect();
		}
	}

	async handleDisconnect(client: AuthenticatedSocket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		this.removeFromConnections(client);
	}
	@SubscribeMessage('joinProject')
	async handleJoinProject(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: { projectId: string; userId: string; token: string }
	) {
		try {
			const { projectId, userId } = data;

			this.logger.log(`User ${userId} attempting to join project ${projectId}`);

			// Проверяем, что пользователь уже аутентифицирован
			if (!client.userId) {
				this.logger.error(`Client ${client.id} not authenticated`);
				client.emit('error', { message: 'Authentication required' });
				return;
			}

			// Проверяем, что userId совпадает с аутентифицированным пользователем
			if (client.userId !== userId) {
				this.logger.error(`User ID mismatch: ${client.userId} vs ${userId}`);
				client.emit('error', { message: 'User ID mismatch' });
				return;
			}

			// TODO: Добавить проверку прав доступа к проекту

			client.projectId = projectId;

			// Добавляем соединение в проект
			if (!this.projectConnections.has(projectId)) {
				this.projectConnections.set(projectId, new Set());
			}
			this.projectConnections.get(projectId).add(client);

			// Добавляем соединение пользователя
			if (!this.userConnections.has(userId)) {
				this.userConnections.set(userId, new Set());
			}
			this.userConnections.get(userId).add(client);

			// Присоединяемся к комнате проекта
			await client.join(`project:${projectId}`);

			// Отправляем непрочитанные уведомления
			const unreadNotifications =
				await this.notificationService.getUnreadNotifications(
					userId,
					projectId
				);

			client.emit('unreadNotifications', {
				notifications: unreadNotifications,
				count: unreadNotifications.length,
			});

			this.logger.log(
				`User ${userId} successfully joined project ${projectId} (room: project:${projectId})`
			);
		} catch (error) {
			this.logger.error('Error joining project:', error);
			client.emit('error', { message: 'Failed to join project' });
		}
	}

	@SubscribeMessage('leaveProject')
	async handleLeaveProject(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: { projectId: string }
	) {
		const { projectId } = data;
		await client.leave(`project:${projectId}`);
		this.removeFromConnections(client);
		this.logger.log(`Client ${client.id} left project ${projectId}`);
	}
	@SubscribeMessage('markAsRead')
	async handleMarkAsRead(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: { notificationId: string }
	) {
		try {
			const result = await this.notificationService.markAsRead(
				data.notificationId
			);
			if (result) {
				client.emit('notificationMarkedAsRead', {
					notificationId: data.notificationId,
				});
				this.logger.log(
					`Notification ${data.notificationId} marked as read by user ${client.userId}`
				);
			} else {
				this.logger.warn(`Notification ${data.notificationId} not found`);
				client.emit('error', { message: 'Notification not found' });
			}
		} catch (error) {
			this.logger.error('Error marking notification as read:', error);
			client.emit('error', { message: 'Failed to mark notification as read' });
		}
	}

	@SubscribeMessage('markAllAsRead')
	async handleMarkAllAsRead(
		@ConnectedSocket() client: AuthenticatedSocket,
		@MessageBody() data: { projectId: string }
	) {
		try {
			if (!client.userId) {
				client.emit('error', { message: 'Authentication required' });
				return;
			}

			const result = await this.notificationService.markAllAsRead(
				client.userId,
				data.projectId
			);
			if (result.count > 0) {
				client.emit('allNotificationsMarkedAsRead', { count: result.count });
				this.logger.log(
					`${result.count} notifications marked as read for user ${client.userId} in project ${data.projectId}`
				);
			}
		} catch (error) {
			this.logger.error('Error marking all notifications as read:', error);
			client.emit('error', {
				message: 'Failed to mark all notifications as read',
			});
		}
	} // Методы для отправки уведомлений
	async notifyProject(projectId: string, notification: any) {
		this.logger.log(
			`Sending notification to project ${projectId}:`,
			notification
		);

		// Отправляем в комнату проекта (это достаточно)
		this.server
			.to(`project:${projectId}`)
			.emit('newNotification', notification);
		this.logger.log(`Notification sent to project room: project:${projectId}`);
	}

	async notifyUser(userId: string, notification: any) {
		const userSockets = this.userConnections.get(userId);
		if (userSockets) {
			for (const socket of userSockets) {
				socket.emit('newNotification', notification);
			}
			this.logger.log(`Notification sent to user ${userId}`);
		}
	}

	async updateProjectNotificationCount(
		projectId: string,
		userId: string,
		count: number
	) {
		const userSockets = this.userConnections.get(userId);
		if (userSockets) {
			for (const socket of userSockets) {
				if (socket.projectId === projectId) {
					socket.emit('notificationCountUpdate', { count });
				}
			}
		}
	}

	private removeFromConnections(client: AuthenticatedSocket) {
		if (client.projectId) {
			const projectSockets = this.projectConnections.get(client.projectId);
			if (projectSockets) {
				projectSockets.delete(client);
				if (projectSockets.size === 0) {
					this.projectConnections.delete(client.projectId);
				}
			}
		}

		if (client.userId) {
			const userSockets = this.userConnections.get(client.userId);
			if (userSockets) {
				userSockets.delete(client);
				if (userSockets.size === 0) {
					this.userConnections.delete(client.userId);
				}
			}
		}
	}

	// Получить количество подключенных пользователей к проекту
	getConnectedUsersCount(projectId: string): number {
		const connections = this.projectConnections.get(projectId);
		return connections ? connections.size : 0;
	}

	// Проверить, подключен ли пользователь к проекту
	isUserConnectedToProject(userId: string, projectId: string): boolean {
		const userSockets = this.userConnections.get(userId);
		if (!userSockets) return false;

		for (const socket of userSockets) {
			if (socket.projectId === projectId) {
				return true;
			}
		}
		return false;
	}
}
