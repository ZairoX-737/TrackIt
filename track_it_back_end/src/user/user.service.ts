import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private taskService: TaskService
	) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: {
				id,
			},
			include: {
				tasks: true,
			},
		});
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: {
				email,
			},
		});
	}

	async create(dto: AuthDto) {
		const user = {
			email: dto.email,
			username: dto.username,
			password: await hash(dto.password),
		};
		return this.prisma.user.create({
			data: user,
		});
	}

	async update(id: string, dto: UserDto) {
		let data = dto;

		if (dto.password) {
			data = { ...dto, password: await hash(dto.password) };
		}
		return this.prisma.user.update({
			where: {
				id,
			},
			data,
			select: {
				username: true,
				email: true,
			},
		});
	}

	async getProfile(id: string) {
		const profile = await this.getById(id);

		const totalTasks = profile.tasks.length;
		const completedTasks = await this.taskService.getCompletedTasks(id);

		const { password, ...rest } = profile;

		return {
			user: rest,
			statistics: [
				{ label: 'Total', value: totalTasks },
				{ label: 'Completed tasks', value: completedTasks },
			],
		};
	}

	async findAll() {
		return this.prisma.user.findMany();
	}
}
