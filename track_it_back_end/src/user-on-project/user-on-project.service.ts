import {
	Injectable,
	ForbiddenException,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserOnProjectService {
	constructor(private prisma: PrismaService) {}

	async getById(userId: string, projectId: string) {
		return this.prisma.userOnProject.findUnique({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
			},
		});
	}

	async getAll() {
		return this.prisma.userOnProject.findMany();
	}

	async getProjectUsers(projectId: string) {
		return this.prisma.userOnProject.findMany({
			where: { projectId },
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
	}

	async getAdmin(userId: string, projectId: string) {
		return this.prisma.userOnProject.findUnique({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
				role: 'admin',
			},
		});
	}

	async createAdmin(userId: string, projectId: string) {
		return this.prisma.userOnProject.create({
			data: {
				userId: userId,
				projectId: projectId,
				role: 'admin',
			},
		});
	}

	async inviteUserByEmail(
		inviterId: string,
		projectId: string,
		email: string,
		role: 'admin' | 'editor'
	) {
		// Check if inviter is admin of the project
		const inviterRole = await this.getAdmin(inviterId, projectId);
		if (!inviterRole) {
			throw new ForbiddenException('Only project admins can invite users');
		}

		// Find user by email
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new NotFoundException('User with this email not found');
		}

		// Check if user is already in project
		const existingMember = await this.getById(user.id, projectId);
		if (existingMember) {
			throw new BadRequestException('User is already a member of this project');
		}

		// Add user to project
		return this.prisma.userOnProject.create({
			data: {
				userId: user.id,
				projectId,
				role,
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
	}

	async removeUserFromProject(
		requesterId: string,
		targetUserId: string,
		projectId: string
	) {
		// Check if requester is admin
		const requesterRole = await this.getAdmin(requesterId, projectId);
		if (!requesterRole) {
			throw new ForbiddenException('Only project admins can remove users');
		}

		// Don't allow removing yourself
		if (requesterId === targetUserId) {
			throw new BadRequestException('Cannot remove yourself from project');
		}

		// Check if target user exists in project
		const targetMember = await this.getById(targetUserId, projectId);
		if (!targetMember) {
			throw new NotFoundException('User is not a member of this project');
		}

		return this.prisma.userOnProject.delete({
			where: {
				userId_projectId: { userId: targetUserId, projectId },
			},
		});
	}

	async delete(userId: string, projectId: string) {
		return this.prisma.userOnProject.delete({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
			},
		});
	}
}
