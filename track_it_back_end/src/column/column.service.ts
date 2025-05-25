import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColumnDto } from './dto/column.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class ColumnService {
	constructor(
		private prisma: PrismaService,
		private boardServise: BoardService
	) {}

	async getAll(boardId: string, userId: string) {
		// Проверяем, что пользователь имеет доступ к доске
		await this.checkBoardAccess(boardId, userId);
		return this.boardServise.getColumns(boardId);
	}

	async create(dto: ColumnDto, boardId: string, userId: string) {
		// Проверяем, что пользователь имеет доступ к доске
		await this.checkBoardAccess(boardId, userId);

		// Получаем максимальный position для этой доски
		const lastColumn = await this.prisma.column.findFirst({
			where: { boardId },
			orderBy: { position: 'desc' },
		});
		const nextPosition = lastColumn ? lastColumn.position + 1 : 1;
		return this.prisma.column.create({
			data: {
				...dto,
				position: dto.position ?? nextPosition,
				board: {
					connect: {
						id: boardId,
					},
				},
			},
		});
	}

	async update(dto: ColumnDto, columnId: string, userId: string) {
		// Получаем колонку и проверяем доступ к её доске
		const column = await this.prisma.column.findUnique({
			where: { id: columnId },
			include: { board: true },
		});

		if (!column) {
			throw new NotFoundException('Колонка не найдена');
		}

		await this.checkBoardAccess(column.boardId, userId);

		return this.prisma.column.update({
			where: {
				id: columnId,
			},
			data: dto,
		});
	}

	async delete(columnId: string, userId: string) {
		// Получаем колонку и проверяем доступ к её доске
		const column = await this.prisma.column.findUnique({
			where: { id: columnId },
			include: { board: true },
		});

		if (!column) {
			throw new NotFoundException('Колонка не найдена');
		}

		await this.checkBoardAccess(column.boardId, userId);

		return this.prisma.column.delete({
			where: {
				id: columnId,
			},
		});
	}

	private async checkBoardAccess(boardId: string, userId: string) {
		// Проверяем, что доска существует и пользователь имеет к ней доступ
		const board = await this.prisma.board.findUnique({
			where: { id: boardId },
			include: {
				project: {
					include: {
						users: {
							where: { userId },
						},
					},
				},
			},
		});

		if (!board) {
			throw new NotFoundException('Доска не найдена');
		}

		// Проверяем, что пользователь является участником проекта или создателем
		const isProjectOwner = board.project.createdBy === userId;
		const isProjectMember = board.project.users.length > 0;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('У вас нет доступа к этой доске');
		}
	}
}
