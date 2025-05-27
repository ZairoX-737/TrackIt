import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';

@Injectable()
export class LabelService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.label.findMany({
			orderBy: {
				createdAt: 'asc',
			},
		});
	}

	async getByProject(projectId: string) {
		return this.prisma.label.findMany({
			where: { projectId },
			orderBy: {
				createdAt: 'asc',
			},
		});
	}

	async getById(id: string) {
		return this.prisma.label.findUnique({
			where: { id },
		});
	}

	async create(dto: CreateLabelDto) {
		return this.prisma.label.create({
			data: dto,
		});
	}

	async update(id: string, dto: UpdateLabelDto) {
		return this.prisma.label.update({
			where: { id },
			data: dto,
		});
	}

	async delete(id: string) {
		return this.prisma.label.delete({
			where: { id },
		});
	}

	async createDefaultLabels(projectId: string) {
		const defaultLabels = [
			{ name: 'Not Started', color: '#6B7280', projectId }, // gray
			{ name: 'In Progress', color: '#3B82F6', projectId }, // blue
			{ name: 'Critical', color: '#EF4444', projectId }, // red
			{ name: 'Done', color: '#10B981', projectId }, // green
		];

		return this.prisma.label.createMany({
			data: defaultLabels,
		});
	}
}
