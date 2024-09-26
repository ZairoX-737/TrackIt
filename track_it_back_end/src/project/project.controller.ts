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
import { ProjectService } from './project.service';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { ProjectDto } from './dto/project.dto';

@Controller('user/project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get('allProjects')
	@Auth()
	async getAll(@CurrentUser('id') createdBy: string) {
		return this.projectService.getAll(createdBy);
	}

	@Get('allProjectsDetailed')
	@Auth()
	async getAllDetailed(@CurrentUser('id') createdBy: string) {
		return this.projectService.getAllDetailed(createdBy);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	async create(@Body() dto: ProjectDto, @CurrentUser('id') createdBy: string) {
		return this.projectService.create(dto, createdBy);
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Body() dto: ProjectDto,
		@CurrentUser('id') createdBy: string,
		@Param('id') projectId: string
	) {
		return this.projectService.update(dto, projectId, createdBy);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') projectId: string) {
		return this.projectService.delete(projectId);
	}
}
