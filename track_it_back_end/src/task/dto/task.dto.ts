import { Priority } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class TaskDto {
	@IsString()
	@IsOptional()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsString()
	@IsOptional()
	@MaxLength(50, {
		message: 'Status must not be longer than 50 characters',
	})
	status: string;

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority: Priority;
}
