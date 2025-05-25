import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Get('task/:taskId')
	@Auth()
	async getTaskComments(@Param('taskId') taskId: string) {
		return this.commentService.getTaskComments(taskId);
	}

	@Post()
	@Auth()
	async createComment(
		@Body() body: { taskId: string; content: string },
		@CurrentUser('id') userId: string
	) {
		return this.commentService.createComment(userId, body.taskId, body.content);
	}

	@Delete(':commentId')
	@Auth()
	async deleteComment(
		@Param('commentId') commentId: string,
		@CurrentUser('id') userId: string
	) {
		return this.commentService.deleteComment(commentId, userId);
	}
}
