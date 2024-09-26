import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BoardDto } from './dto/board.dto';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class BoardService {
	constructor(
		private prisma: PrismaService,
		private projectService: ProjectService
	) {}

	async getAll(createdBy: string) {
		return this.projectService.getBoards(createdBy);
	}

	async getColumns(boardId: string) {
		return this.prisma.board.findMany({
			where: {
				id: boardId,
			},
			select: {
				name: true,
				columns: true,
			},
		});
	}

	async create(dto: BoardDto, projectId: string) {
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

	async update(dto: BoardDto, boardId: string) {
		return this.prisma.board.update({
			where: {
				id: boardId,
			},
			data: dto,
		});
	}

	async delete(boardId: string) {
		return this.prisma.board.delete({
			where: {
				id: boardId,
			},
		});
	}
}
