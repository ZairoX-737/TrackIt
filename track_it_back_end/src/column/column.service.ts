import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColumnDto } from './dto/column.dto';
import { BoardService } from 'src/board/board.service';
import { NotificationIntegrationService } from '../notification/notification-integration.service';

@Injectable()
export class ColumnService {
	constructor(
		private prisma: PrismaService,
		private boardService: BoardService,
		private notificationIntegration: NotificationIntegrationService
	) {}
	async getAll(boardId: string, userId: string) {
		// Проверяем, что пользователь имеет доступ к доске
		await this.checkBoardAccess(boardId, userId);
		return this.boardService.getColumns(boardId);
	}
	async create(dto: ColumnDto, boardId: string, userId: string) {
		// Проверяем, что пользователь имеет доступ к доске
		await this.checkBoardAccess(boardId, userId);

		// Получаем информацию о доске и проекте
		const board = await this.prisma.board.findUnique({
			where: { id: boardId },
			include: {
				project: true,
			},
		});

		// Получаем максимальный position для этой доски
		const lastColumn = await this.prisma.column.findFirst({
			where: { boardId },
			orderBy: { position: 'desc' },
		});
		const nextPosition = lastColumn ? lastColumn.position + 1 : 1;

		const column = await this.prisma.column.create({
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

		// Send notification about new column
		if (board) {
			await this.notificationIntegration.notifyColumnCreated(
				board.projectId,
				column.id,
				column.name,
				userId
			);
		}

		return column;
	}
	async update(dto: ColumnDto, columnId: string, userId: string) {
		// Получаем колонку и проверяем доступ к её доске
		const column = await this.prisma.column.findUnique({
			where: { id: columnId },
			include: {
				board: {
					include: {
						project: true,
					},
				},
			},
		});

		if (!column) {
			throw new NotFoundException('Колонка не найдена');
		}

		await this.checkBoardAccess(column.boardId, userId);

		const updatedColumn = await this.prisma.column.update({
			where: {
				id: columnId,
			},
			data: dto,
		});

		// Send notification about column update
		await this.notificationIntegration.notifyColumnUpdated(
			column.board.projectId,
			columnId,
			updatedColumn.name,
			userId
		);

		return updatedColumn;
	}
	async delete(columnId: string, userId: string) {
		// Получаем колонку и проверяем доступ к её доске
		const column = await this.prisma.column.findUnique({
			where: { id: columnId },
			include: {
				board: {
					include: {
						project: true,
					},
				},
			},
		});

		if (!column) {
			throw new NotFoundException('Колонка не найдена');
		}

		await this.checkBoardAccess(column.boardId, userId);

		// Store column info for notification before deletion
		const columnInfo = {
			name: column.name,
			projectId: column.board.projectId,
		};

		const deletedColumn = await this.prisma.column.delete({
			where: {
				id: columnId,
			},
		});

		// Send notification about column deletion
		await this.notificationIntegration.notifyColumnDeleted(
			columnInfo.projectId,
			columnInfo.name,
			userId
		);

		return deletedColumn;
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
