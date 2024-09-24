import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}
	EXPIRE_DAY_REFRESH_TOKEN = 1;
	REFRESH_TOKEN_NAME = 'refreshToken';
	DOMAIN = this.configService.get('DOMAIN');

	async login(dto: AuthDto) {
		const { password, ...user } = await this.validateUser(dto);
		const tokens = this.isssueTokens(user.id);
		return {
			user,
			...tokens,
		};
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userService.getByEmail(dto.email);

		if (oldUser) throw new BadRequestException('User already exists');

		const { password, ...user } = await this.userService.create(dto);

		const tokens = this.isssueTokens(user.id);

		return {
			user,
			...tokens,
		};
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);
		if (!result) throw new UnauthorizedException('Invalid refresh token');

		const { password, ...user } = await this.userService.getById(result.id);

		const tokens = this.isssueTokens(user.id);

		return {
			user,
			...tokens,
		};
	}

	private isssueTokens(userId: string) {
		const data = { id: userId };

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h',
		});
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d',
		});

		return { accessToken, refreshToken };
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByEmail(dto.email);

		if (!user) throw new NotFoundException('User not found');

		const isValid = await verify(user.password, dto.password);

		if (!isValid) throw new UnauthorizedException('Invalid password');

		return user;
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.DOMAIN,
			expires: expiresIn,
			secure: true,
			// lax if prod
			sameSite: 'none',
		});
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.DOMAIN,
			expires: new Date(0),
			secure: true,
			// lax if prod
			sameSite: 'none',
		});
	}
}
