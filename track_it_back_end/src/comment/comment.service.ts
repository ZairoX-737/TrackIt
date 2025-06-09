import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NotificationIntegrationService } from '../notification/notification-integration.service';

@Injectable()
export class CommentService {
	constructor(
		private prisma: PrismaService,
		private notificationIntegration: NotificationIntegrationService
	) {}

	async getTaskComments(taskId: string) {
		return this.prisma.comment.findMany({
			where: { taskId },
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});
	}
	async createComment(userId: string, taskId: string, content: string) {
		// Check if task exists and get project info
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
			include: {
				column: {
					include: {
						board: {
							include: {
								project: true,
							},
						},
					},
				},
			},
		});

		if (!task) {
			throw new NotFoundException('Task not found');
		}

		const comment = await this.prisma.comment.create({
			data: {
				userId,
				taskId,
				content,
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
			},
		});
		// Send notification about new comment
		await this.notificationIntegration.notifyCommentCreated(
			task.column.board.project.id,
			task.id,
			comment.id,
			task.title,
			userId
		);

		return comment;
	}

	async deleteComment(commentId: string, userId: string) {
		const comment = await this.prisma.comment.findUnique({
			where: { id: commentId },
		});

		if (!comment) {
			throw new NotFoundException('Comment not found');
		}

		if (comment.userId !== userId) {
			throw new ForbiddenException('You can only delete your own comments');
		}

		return this.prisma.comment.delete({
			where: { id: commentId },
		});
	}
}
