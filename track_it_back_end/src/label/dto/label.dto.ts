import { IsString, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class CreateLabelDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(50, {
		message: 'Label name must not be longer than 50 characters',
	})
	name: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
		message: 'Color must be a valid hex color (e.g., #FF6565)',
	})
	color: string;
}

export class UpdateLabelDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(50, {
		message: 'Label name must not be longer than 50 characters',
	})
	name?: string;

	@IsString()
	@IsNotEmpty()
	@Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
		message: 'Color must be a valid hex color (e.g., #FF6565)',
	})
	color?: string;
}
