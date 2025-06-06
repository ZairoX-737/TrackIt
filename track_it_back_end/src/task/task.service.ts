import {
	Injectable,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}
	async getAll(userId: string) {
		// Получаем все задачи из досок проектов, к которым пользователь имеет доступ
		return this.prisma.task.findMany({
			where: {
				column: {
					board: {
						project: {
							OR: [
								{ createdBy: userId }, // Проекты, созданные пользователем
								{
									users: {
										some: {
											userId: userId, // Проекты, в которых пользователь является участником
										},
									},
								},
							],
						},
					},
				},
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
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
				column: {
					name: {
						in: ['Done', 'Completed', 'Завершено', 'Готово'],
					},
				},
			},
		});
	}
	async getById(taskId: string, userId: string) {
		const task = await this.prisma.task.findUnique({
			where: { id: taskId },
			include: {
				column: {
					include: {
						board: {
							include: {
								project: {
									include: {
										users: {
											where: { userId },
										},
									},
								},
							},
						},
					},
				},
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
				labels: {
					include: {
						label: true,
					},
				},
			},
		});

		if (!task) {
			throw new NotFoundException('Task not found');
		}

		// Проверяем, что пользователь имеет доступ к проекту, в котором находится задача
		const project = task.column.board.project;
		const isProjectOwner = project.createdBy === userId;
		const isProjectMember = project.users.length > 0;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('You do not have access to this task');
		}

		return task;
	}
	async create(dto: TaskDto, createdBy: string, columnId: string) {
		// Проверяем доступ к колонке
		await this.checkColumnAccess(columnId, createdBy);

		const { labelIds, columnId: _, ...taskData } = dto;

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
		// Возвращаем задачу с лейблами и информацией о пользователе
		return this.prisma.task.findUnique({
			where: { id: task.id },
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
				labels: {
					include: {
						label: true,
					},
				},
			},
		});
	}
	async update(dto: Partial<TaskDto>, taskId: string, createdBy: string) {
		// Проверяем, что задача существует и принадлежит пользователю
		const existingTask = await this.prisma.task.findUnique({
			where: { id: taskId },
			include: {
				column: {
					include: {
						board: {
							include: {
								project: {
									include: {
										users: {
											where: { userId: createdBy },
										},
									},
								},
							},
						},
					},
				},
				labels: true,
			},
		});

		if (!existingTask) {
			throw new NotFoundException('Task not found');
		}

		// Проверяем доступ к проекту
		const project = existingTask.column.board.project;
		const isProjectOwner = project.createdBy === createdBy;
		const isProjectMember = project.users.length > 0;
		const isTaskOwner = existingTask.createdBy === createdBy;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('You do not have access to this task');
		}
		// Получаем роль пользователя в проекте
		const userRole = await this.prisma.userOnProject.findUnique({
			where: {
				userId_projectId: {
					userId: createdBy,
					projectId: project.id,
				},
			},
		});

		// Создатель проекта всегда админ, даже если нет записи в userOnProject
		const isProjectAdmin = isProjectOwner || userRole?.role === 'admin';

		// Админы проекта могут редактировать любые задачи, остальные - только свои
		if (!isProjectAdmin && !isTaskOwner) {
			throw new ForbiddenException(
				'You can only edit your own tasks or you must be a project administrator'
			);
		}

		// Если меняется колонка, проверяем доступ к новой колонке
		if (dto.columnId && dto.columnId !== existingTask.columnId) {
			await this.checkColumnAccess(dto.columnId, createdBy);
		}

		const { labelIds, ...taskData } = dto;

		// Извлекаем только разрешенные для обновления поля
		const allowedFields = {
			...(taskData.title && { title: taskData.title }),
			...(taskData.description !== undefined && {
				description: taskData.description,
			}),
			...(taskData.columnId && { columnId: taskData.columnId }),
		};

		// Первый шаг: обновляем данные задачи
		const updatedTask = await this.prisma.task.update({
			where: {
				id: taskId,
			},
			data: allowedFields,
		});

		// Если массив labelIds определен, обновляем метки
		if (labelIds) {
			// Удаляем существующие связи с метками
			await this.prisma.labelOnTask.deleteMany({
				where: { taskId },
			});

			// Создаем новые связи с метками, если массив не пустой
			if (labelIds.length > 0) {
				await this.prisma.labelOnTask.createMany({
					data: labelIds.map(labelId => ({
						taskId,
						labelId,
					})),
				});
			}
		}
		// Возвращаем обновленную задачу с метками и информацией о пользователе
		return this.prisma.task.findUnique({
			where: { id: taskId },
			include: {
				user: {
					select: {
						id: true,
						username: true,
						email: true,
					},
				},
				labels: {
					include: {
						label: true,
					},
				},
			},
		});
	}
	async delete(taskId: string, userId: string) {
		// Проверяем, что задача существует и пользователь имеет к ней доступ
		const existingTask = await this.prisma.task.findUnique({
			where: { id: taskId },
			include: {
				column: {
					include: {
						board: {
							include: {
								project: {
									include: {
										users: {
											where: { userId },
										},
									},
								},
							},
						},
					},
				},
			},
		});

		if (!existingTask) {
			throw new NotFoundException('Task not found');
		}

		// Проверяем доступ к проекту
		const project = existingTask.column.board.project;
		const isProjectOwner = project.createdBy === userId;
		const isProjectMember = project.users.length > 0;
		const isTaskOwner = existingTask.createdBy === userId;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('You are not a member of this project');
		}
		if (isProjectOwner) {
			// Удаляем связи с лейблами перед удалением задачи
			await this.prisma.labelOnTask.deleteMany({
				where: { taskId },
			});

			await this.prisma.task.delete({
				where: {
					id: taskId,
				},
			});
			return;
		}

		// Админы проекта могут удалять любые задачи, остальные - только свои
		if (!isTaskOwner) {
			throw new ForbiddenException(
				'You can only delete your own tasks or you must be a project administrator'
			);
		}

		// Удаляем связи с лейблами перед удалением задачи
		await this.prisma.labelOnTask.deleteMany({
			where: { taskId },
		});

		await this.prisma.task.delete({
			where: {
				id: taskId,
			},
		});
	}

	private async checkColumnAccess(columnId: string, userId: string) {
		// Проверяем, что колонка существует и пользователь имеет к ней доступ
		const column = await this.prisma.column.findUnique({
			where: { id: columnId },
			include: {
				board: {
					include: {
						project: {
							include: {
								users: {
									where: { userId },
								},
							},
						},
					},
				},
			},
		});

		if (!column) {
			throw new NotFoundException('Column not found');
		}

		// Проверяем, что пользователь является участником проекта или создателем
		const isProjectOwner = column.board.project.createdBy === userId;
		const isProjectMember = column.board.project.users.length > 0;

		if (!isProjectOwner && !isProjectMember) {
			throw new ForbiddenException('You do not have access to this column');
		}
	}
}
