import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColumnDto } from './dto/column.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class ColumnService {
	constructor(
		private prisma: PrismaService,
		private boardServise: BoardService
	) {}

	async getAll(boardId: string) {
		return this.boardServise.getColumns(boardId);
	}

	async create(dto: ColumnDto, boardId: string) {
		return this.prisma.column.create({
			data: {
				...dto,
				board: {
					connect: {
						id: boardId,
					},
				},
			},
		});
	}

	async update(dto: ColumnDto, columnId: string) {
		return this.prisma.column.update({
			where: {
				id: columnId,
			},
			data: dto,
		});
	}

	async delete(columnId: string) {
		return this.prisma.column.delete({
			where: {
				id: columnId,
			},
		});
	}
}
