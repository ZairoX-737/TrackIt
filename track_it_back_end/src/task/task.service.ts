import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAll(createdBy: string) {
		return this.prisma.task.findMany({
			where: {
				createdBy,
			},
		});
	}

	async getCompletedTasks(createdBy: string) {
		return this.prisma.task.count({
			where: {
				createdBy,
				status: 'done',
			},
		});
	}

	async create(dto: TaskDto, createdBy: string, columnId: string) {
		return this.prisma.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: createdBy,
					},
				},
				column: {
					connect: {
						id: columnId,
					},
				},
			},
		});
	}

	async update(dto: Partial<TaskDto>, taskId: string, createdBy: string) {
		return this.prisma.task.update({
			where: {
				createdBy,
				id: taskId,
			},
			data: dto,
		});
	}

	async delete(taskId: string) {
		return this.prisma.task.delete({
			where: {
				id: taskId,
			},
		});
	}
}
