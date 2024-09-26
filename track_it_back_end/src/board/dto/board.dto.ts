import { IsOptional, IsString } from 'class-validator';

export class BoardDto {
	@IsString()
	name: string;
}
