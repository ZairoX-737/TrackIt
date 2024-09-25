import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
	@IsEmail()
	@IsOptional()
	email?: string;

	@MinLength(3, {
		message: 'Username must be at least 3 characters long',
	})
	@IsOptional()
	username?: string;

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	@IsOptional()
	password?: string;
}
