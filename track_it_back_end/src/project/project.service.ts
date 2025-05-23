import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { UserOnProjectService } from 'src/user-on-project/user-on-project.service';

@Injectable()
export class ProjectService {
	constructor(
		private prisma: PrismaService,
		private userOnProject: UserOnProjectService
	) {}

	async getAll(createdBy: string) {
		return this.prisma.project.findMany({
			where: {
				createdBy,
			},
			include: {
				users: {
					select: {
						userId: true,
						role: true,
					},
				},
			},
		});
	}

	async getAllUserOnProject() {
		return this.userOnProject.getAll();
	}

	async getAllDetailed(createdBy: string) {
		return this.prisma.project.findMany({
			where: {
				createdBy,
			},
			include: {
				boards: {
					include: {
						columns: {
							include: {
								tasks: {
									include: {
										labels: true,
										comments: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	async getBoards(projectId: string) {
		return this.prisma.board.findMany({
			where: { projectId },
		});
	}

	async create(dto: ProjectDto, userId: string) {
		const project = await this.prisma.project.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});
		const projectId = project.id;
		this.userOnProject.createAdmin(userId, projectId);
		return project;
	}

	async connect(userId: string, projectId: string) {
		const oldUser = await this.userOnProject.getById(userId, projectId);

		if (oldUser)
			throw new BadRequestException('User already connected to this project');

		return this.prisma.userOnProject.create({
			data: {
				userId: userId,
				projectId: projectId,
				role: 'editor',
			},
		});
	}

	async disconnect(userId: string, projectId: string) {
		const oldUser = await this.userOnProject.getById(userId, projectId);

		if (!oldUser)
			throw new BadRequestException('User do not exist in this project');
		if (oldUser.role == 'admin')
			throw new BadRequestException("You can't leave this project as creator");

		return this.userOnProject.delete(userId, projectId);
	}

	async update(dto: ProjectDto, projectId: string, userId: string) {
		const admin = await this.userOnProject.getAdmin(userId, projectId);

		if (!admin)
			throw new BadRequestException('you must be an admin to do this');

		return this.prisma.project.update({
			where: {
				id: projectId,
			},
			data: dto,
		});
	}

	async delete(projectId: string, userId: string) {
		const admin = await this.userOnProject.getAdmin(userId, projectId);

		if (!admin)
			throw new BadRequestException('you must be an admin to do this');

		return this.prisma.project.delete({
			where: {
				id: projectId,
			},
		});
	}
}
