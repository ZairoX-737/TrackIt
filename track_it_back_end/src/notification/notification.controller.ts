import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Query,
	Body,
	UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../decorators/user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Get()
	async getNotifications(
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId?: string,
		@Query('unreadOnly') unreadOnly?: string
	) {
		if (unreadOnly === 'true') {
			return this.notificationService.getUnreadNotifications(userId, projectId);
		}
		return this.notificationService.getAllNotifications(userId, projectId);
	}

	@Get('count')
	async getUnreadCount(
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId?: string
	) {
		const count = await this.notificationService.getUnreadCount(
			userId,
			projectId
		);
		return { count };
	}

	@Put(':id/read')
	async markAsRead(@Param('id') notificationId: string) {
		return this.notificationService.markAsRead(notificationId);
	}

	@Put('read-all')
	async markAllAsRead(
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId?: string
	) {
		return this.notificationService.markAllAsRead(userId, projectId);
	}

	@Delete(':id')
	async deleteNotification(@Param('id') notificationId: string) {
		return this.notificationService.deleteNotification(notificationId);
	}

	@Delete()
	async deleteAllNotifications(
		@CurrentUser('id') userId: string,
		@Query('projectId') projectId?: string
	) {
		return this.notificationService.deleteAllNotifications(userId, projectId);
	}
}
