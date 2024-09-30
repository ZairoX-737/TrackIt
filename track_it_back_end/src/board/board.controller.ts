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
import { BoardService } from './board.service';
import { Auth } from 'src/decorators/auth.decorator';
import { BoardDto } from './dto/board.dto';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('user/project/:PROJECT_ID/board')
export class BoardController {
	constructor(private readonly boardService: BoardService) {}

	@Get('allBoards')
	@Auth()
	async getAll(@Param('PROJECT_ID') projectId: string) {
		return this.boardService.getAll(projectId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(
		@Body() dto: BoardDto,
		@Param('PROJECT_ID') projectId: string,
		@CurrentUser('id') userId: string
	) {
		return this.boardService.create(dto, projectId, userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':BOARD_ID')
	@Auth()
	async update(
		@Body() dto: BoardDto,
		@Param('PROJECT_ID') projectId: string,
		@Param('BOARD_ID') boardId: string,
		@CurrentUser('id') userId: string
	) {
		return this.boardService.update(dto, boardId, userId, projectId);
	}

	@HttpCode(200)
	@Delete(':BOARD_ID')
	@Auth()
	async delete(
		@Param('PROJECT_ID') projectId: string,
		@Param('BOARD_ID') boardId: string,
		@CurrentUser('id') userId: string
	) {
		return this.boardService.delete(boardId, userId, projectId);
	}
}
