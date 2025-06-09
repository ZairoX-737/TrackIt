import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLabelDto, UpdateLabelDto } from './dto/label.dto';
import { NotificationIntegrationService } from '../notification/notification-integration.service';

@Injectable()
export class LabelService {
	constructor(
		private prisma: PrismaService,
		private notificationIntegration: NotificationIntegrationService
	) {}

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
	async create(dto: CreateLabelDto, createdBy?: string) {
		const label = await this.prisma.label.create({
			data: dto,
		});

		// Send notification if createdBy is provided and projectId exists
		if (createdBy && dto.projectId) {
			await this.notificationIntegration.notifyLabelCreated(
				dto.projectId,
				label.id,
				label.name,
				createdBy
			);
		}

		return label;
	}
	async update(id: string, dto: UpdateLabelDto, updatedBy?: string) {
		// Get label info before update for notification
		const existingLabel = await this.prisma.label.findUnique({
			where: { id },
		});

		const label = await this.prisma.label.update({
			where: { id },
			data: dto,
		});

		// Send notification if updatedBy is provided and projectId exists
		if (updatedBy && existingLabel?.projectId) {
			await this.notificationIntegration.notifyLabelUpdated(
				existingLabel.projectId,
				id,
				label.name,
				updatedBy
			);
		}

		return label;
	}
	async delete(id: string, deletedBy?: string) {
		// Get label info before deletion for notification
		const existingLabel = await this.prisma.label.findUnique({
			where: { id },
		});

		const label = await this.prisma.label.delete({
			where: { id },
		});

		// Send notification if deletedBy is provided and projectId exists
		if (deletedBy && existingLabel?.projectId) {
			await this.notificationIntegration.notifyLabelDeleted(
				existingLabel.projectId,
				existingLabel.name,
				deletedBy
			);
		}

		return label;
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
