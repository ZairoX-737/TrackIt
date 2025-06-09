import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	HttpCode,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';

@Controller('labels')
export class LabelController {
	constructor(private readonly labelService: LabelService) {}

	@Get('allLabels')
	async getAll() {
		return this.labelService.getAll();
	}

	@Get('project/:projectId')
	async getByProject(@Param('projectId') projectId: string) {
		return this.labelService.getByProject(projectId);
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.labelService.getById(id);
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(201)
	@Post()
	@Auth()
	async create(@Body() dto: CreateLabelDto, @CurrentUser('id') userId: string) {
		return this.labelService.create(dto, userId);
	}
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put(':id')
	@Auth()
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateLabelDto,
		@CurrentUser('id') userId: string
	) {
		return this.labelService.update(id, dto, userId);
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth()
	async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.labelService.delete(id, userId);
	}
}
