import $api from './http';
import { Column, ColumnDto } from './types';

export class ColumnService {
	static async getAll(boardId: string): Promise<Column[]> {
		const response = await $api.get<Column[]>(
			`/user/column/${boardId}/allColumns`
		);
		return response.data;
	}

	static async create(boardId: string, data: ColumnDto): Promise<Column> {
		const response = await $api.post<Column>(`/user/column/${boardId}`, data);
		return response.data;
	}

	static async update(columnId: string, data: ColumnDto): Promise<Column> {
		const response = await $api.put<Column>(`/user/column/${columnId}`, data);
		return response.data;
	}

	static async delete(columnId: string): Promise<void> {
		await $api.delete(`/user/column/${columnId}`);
	}
}
