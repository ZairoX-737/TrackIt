import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsArray } from 'class-validator';

export class TaskDto {
	@IsString()
	title: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	labelIds?: string[];

	@IsString()
	@IsOptional()
	columnId?: string;
}
