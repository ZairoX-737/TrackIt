import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ColumnDto {
	@IsString()
	@IsOptional()
	name: string;

	@IsInt()
	@Min(1)
	@Max(5)
	@IsOptional()
	position: number;
}
