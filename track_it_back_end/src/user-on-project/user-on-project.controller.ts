import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { UserOnProjectService } from './user-on-project.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('user-on-project')
export class UserOnProjectController {
	constructor(private readonly userOnProjectService: UserOnProjectService) {}

	@Get('project/:projectId')
	@Auth()
	async getProjectUsers(@Param('projectId') projectId: string) {
		return this.userOnProjectService.getProjectUsers(projectId);
	}

	@Post('invite')
	@Auth()
	async inviteUserByEmail(
		@Body()
		body: { projectId: string; email: string; role?: 'admin' | 'editor' },
		@CurrentUser('id') userId: string
	) {
		return this.userOnProjectService.inviteUserByEmail(
			userId,
			body.projectId,
			body.email,
			body.role || 'editor'
		);
	}

	@Delete(':userId/:projectId')
	@Auth()
	async removeUserFromProject(
		@Param('userId') targetUserId: string,
		@Param('projectId') projectId: string,
		@CurrentUser('id') currentUserId: string
	) {
		return this.userOnProjectService.removeUserFromProject(
			currentUserId,
			targetUserId,
			projectId
		);
	}
}
