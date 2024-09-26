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
import { TaskService } from './task.service';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { TaskDto } from './dto/task.dto';

@Controller('user/task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get('completedTasks')
	@Auth()
	async completedTasks(@CurrentUser('id') userId: string) {
		return this.taskService.getCompletedTasks(userId);
	}

	@Get('allTasks')
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return this.taskService.getAll(userId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post(':columnId')
	@Auth()
	async create(
		@Body() dto: TaskDto,
		@CurrentUser('id') createdBy: string,
		@Param('columnId') columnId: string
	) {
		return this.taskService.create(dto, createdBy, columnId);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':taskId')
	@Auth()
	async update(
		@Body() dto: TaskDto,
		@CurrentUser('id') createdBy: string,
		@Param('taskId') taskId: string
	) {
		return this.taskService.update(dto, taskId, createdBy);
	}

	@HttpCode(200)
	@Delete(':taskId')
	@Auth()
	async delete(@Param('taskId') taskId: string) {
		return this.taskService.delete(taskId);
	}
}
