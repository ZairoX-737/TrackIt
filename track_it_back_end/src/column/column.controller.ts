import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { Auth } from 'src/decorators/auth.decorator';
import { ColumnDto } from './dto/column.dto';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('user/column')
export class ColumnController {
	constructor(private readonly columnService: ColumnService) {}

	@Get(':boardId/allColumns')
	@Auth()
	async getAll(
		@Param('boardId') boardId: string,
		@CurrentUser('id') userId: string
	) {
		return this.columnService.getAll(boardId, userId);
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':boardId')
	@Auth()
	async create(
		@Body() dto: ColumnDto,
		@Param('boardId') boardId: string,
		@CurrentUser('id') userId: string
	) {
		return this.columnService.create(dto, boardId, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':columnId')
	@Auth()
	async update(
		@Body() dto: ColumnDto,
		@Param('columnId') columnId: string,
		@CurrentUser('id') userId: string
	) {
		return this.columnService.update(dto, columnId, userId);
	}

	@HttpCode(200)
	@Delete(':columnId')
	@Auth()
	async delete(
		@Param('columnId') columnId: string,
		@CurrentUser('id') userId: string
	) {
		return this.columnService.delete(columnId, userId);
	}
}
