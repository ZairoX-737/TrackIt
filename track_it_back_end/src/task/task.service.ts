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
			include: {
				labels: {
					include: {
						label: true,
					},
				},
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
		const { labelIds, ...taskData } = dto;

		const task = await this.prisma.task.create({
			data: {
				...taskData,
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

		// Если есть labelIds, создаём связи с лейблами
		if (labelIds && labelIds.length > 0) {
			await this.prisma.labelOnTask.createMany({
				data: labelIds.map(labelId => ({
					taskId: task.id,
					labelId,
				})),
			});
		}

		// Возвращаем задачу с лейблами
		return this.prisma.task.findUnique({
			where: { id: task.id },
			include: {
				labels: {
					include: {
						label: true,
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
