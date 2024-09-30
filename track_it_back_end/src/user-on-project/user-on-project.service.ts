import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserOnProjectService {
	constructor(private prisma: PrismaService) {}

	async getById(userId: string, projectId: string) {
		return this.prisma.userOnProject.findUnique({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
			},
		});
	}

	async getAll() {
		return this.prisma.userOnProject.findMany();
	}

	async getAdmin(userId: string, projectId: string) {
		return this.prisma.userOnProject.findUnique({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
				role: 'admin',
			},
		});
	}

	async createAdmin(userId: string, projectId: string) {
		return this.prisma.userOnProject.create({
			data: {
				userId: userId,
				projectId: projectId,
				role: 'admin',
			},
		});
	}

	async delete(userId: string, projectId: string) {
		return this.prisma.userOnProject.delete({
			where: {
				userId_projectId: { userId: userId, projectId: projectId },
			},
		});
	}
}
