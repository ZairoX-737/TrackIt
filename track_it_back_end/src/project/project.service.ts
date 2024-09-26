import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
	constructor(private prisma: PrismaService) {}

	async getAll(createdBy: string) {
		return this.prisma.project.findMany({
			where: {
				createdBy,
			},
		});
	}

	async getAllDetailed(createdBy: string) {
		return this.prisma.project.findMany({
			where: {
				createdBy,
			},
			include: {
				boards: {
					include: {
						columns: {
							include: {
								tasks: {
									include: {
										labels: true,
										comments: true,
									},
								},
							},
						},
					},
				},
			},
		});
	}

	async getBoards(createdBy: string) {
		return this.prisma.project.findMany({
			where: {
				createdBy,
			},
			select: {
				id: true,
				name: true,
				boards: true,
			},
		});
	}

	async create(dto: ProjectDto, createdBy: string) {
		return this.prisma.project.create({
			data: {
				...dto,
				user: {
					connect: {
						id: createdBy,
					},
				},
			},
		});
	}

	async update(dto: ProjectDto, projectId: string, createdBy: string) {
		return this.prisma.project.update({
			where: {
				createdBy,
				id: projectId,
			},
			data: dto,
		});
	}

	async delete(projectId: string) {
		return this.prisma.project.delete({
			where: {
				id: projectId,
			},
		});
	}
}
