import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { Auth } from 'src/decorators/auth.decorator';
import { BoardDto } from './dto/board.dto';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('user/board')
export class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Get('allBoards')
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.boardService.getAll(userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':projectId')
	@Auth()
	async create(@Body() dto: BoardDto, @Param('projectId') projectId: string) {
		return this.boardService.create(dto, projectId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':boardId')
	@Auth()
	async update(@Body() dto: BoardDto, @Param('boardId') boardId: string) {
		return this.boardService.update(dto, boardId);
	}

	@HttpCode(200)
	@Delete(':boardId')
	@Auth()
	async delete(@Query('boardId') boardId: string) {
		return this.boardService.delete(boardId);
	}
}
