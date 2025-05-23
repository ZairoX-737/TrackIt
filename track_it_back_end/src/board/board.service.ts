import { BadRequestException, Injectable } from '@nestjs/common';
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

	async getAll(projectId: string) {
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
		const admin = await this.userOnProject.getAdmin(userId, projectId);

		if (!admin)
			throw new BadRequestException('you must be an admin to do this');

		return this.prisma.board.delete({
			where: {
				id: boardId,
			},
		});
	}
}
