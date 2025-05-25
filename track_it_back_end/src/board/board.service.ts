import {
	BadRequestException,
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BoardDto } from './dto/board.dto';
import { ProjectService } from 'src/project/project.service';
import { UserOnProjectService } from 'src/user-on-project/user-on-project.service';

@Injectable()
export class BoardService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService,
		private userOnProject: UserOnProjectService
	) {}
	async getAll(projectId: string, userId: string) {
		// Проверяем доступ к проекту
		await this.checkProjectAccess(projectId, userId);
		return this.projectService.getBoards(projectId);
	}

	async getColumns(boardId: string) {
		return this.prisma.column.findMany({
			where: { boardId },
		});
	}

	async create(dto: BoardDto, projectId: string, userId: string) {
		const user = this.userOnProject.getById(userId, projectId);

		if (!user)
			throw new BadRequestException(
				'user must be connected to this project to do this'
			);
		return this.prisma.board.create({
			data: {
				...dto,
				project: {
					connect: {
						id: projectId,
					},
				},
			},
		});
	}

	async update(
		dto: BoardDto,
		boardId: string,
		userId: string,
		projectId: string
	) {
		const user = await this.userOnProject.getById(userId, projectId);
		if (!user)
			throw new BadRequestException(
				'user must be connected to this project to do this'
			);
		return this.prisma.board.update({
			where: {
				id: boardId,
			},
			data: dto,
		});
	}
	async delete(boardId: string, userId: string, projectId: string) {
		try {
			const admin = await this.userOnProject.getAdmin(userId, projectId);

			if (!admin) {
				throw new ForbiddenException(
					'У вас нет прав администратора для удаления доски'
				);
			}

			return this.prisma.board.delete({
				where: {
					id: boardId,
				},
			});
		} catch (error) {
			if (error instanceof ForbiddenException) {
				throw error;
			}
			throw new BadRequestException(
				'Ошибка при удалении доски: ' + error.message
			);
		}
	}

	private async checkProjectAccess(projectId: string, userId: string) {
		// Проверяем, что проект существует и пользователь имеет к нему доступ
		const project = await this.prisma.project.findUnique({
			where: { id: projectId },
			include: {
				users: {
					where: { userId },
				},
			},
		});

		if (!project) {
			throw new NotFoundException('Проект не найден');
		}

		// Проверяем, что пользователь является участником проекта или создателем
		const isProjectOwner = project.createdBy === userId;
		const isProjectMember = project.users.length > 0;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('У вас нет доступа к этому проекту');
		}
	}
}
