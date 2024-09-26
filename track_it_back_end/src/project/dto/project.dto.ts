import { IsString } from 'class-validator';

export class ProjectDto {
	@IsString()
	name: string;
}
