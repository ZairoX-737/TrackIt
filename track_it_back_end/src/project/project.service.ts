import {
	BadRequestException,
	Injectable,
	ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectDto } from './dto/project.dto';
import { UserOnProjectService } from 'src/user-on-project/user-on-project.service';
import { LabelService } from 'src/label/label.service';

@Injectable()
export class ProjectService {
	constructor(
		private prisma: PrismaService,
		private userOnProject: UserOnProjectService,
		private labelService: LabelService
	) {}
	async getAll(userId: string) {
		// Получаем как созданные пользователем проекты, так и проекты, в которых пользователь участвует
		return this.prisma.project.findMany({
			where: {
				OR: [
					{ createdBy: userId }, // Проекты, созданные пользователем
					{
						users: {
							some: {
								userId: userId, // Проекты, в которых пользователь является участником
							},
						},
					},
				],
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
	async getAllDetailed(userId: string) {
		return this.prisma.project.findMany({
			where: {
				OR: [
					{ createdBy: userId }, // Проекты, созданные пользователем
					{
						users: {
							some: {
								userId: userId, // Проекты, в которых пользователь является участником
							},
						},
					},
				],
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

		// Create default labels for the new project
		await this.labelService.createDefaultLabels(projectId);

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
		try {
			const admin = await this.userOnProject.getAdmin(userId, projectId);

			if (!admin) {
				throw new ForbiddenException(
					'У вас нет прав администратора для удаления проекта'
				);
			}

			return this.prisma.project.delete({
				where: {
					id: projectId,
				},
			});
		} catch (error) {
			if (error instanceof ForbiddenException) {
				throw error;
			}
			throw new BadRequestException(
				'Ошибка при удалении проекта: ' + error.message
			);
		}
	}
}
