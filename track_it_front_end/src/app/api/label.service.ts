import $api from './http';
import { Label } from './types';

export interface CreateLabelDto {
	name: string;
	color: string;
}

export interface UpdateLabelDto {
	name?: string;
	color?: string;
}

export class LabelService {
	static async getAll(): Promise<Label[]> {
		const response = await $api.get<Label[]>('/labels/allLabels');
		return response.data;
	}

	static async getById(id: string): Promise<Label> {
		const response = await $api.get<Label>(`/labels/${id}`);
		return response.data;
	}

	static async create(data: CreateLabelDto): Promise<Label> {
		const response = await $api.post<Label>('/labels', data);
		return response.data;
	}

	static async update(id: string, data: UpdateLabelDto): Promise<Label> {
		const response = await $api.put<Label>(`/labels/${id}`, data);
		return response.data;
	}

	static async delete(id: string): Promise<void> {
		await $api.delete(`/labels/${id}`);
	}
}
