import $api from './http';
import { Board, BoardDto } from './types';

export class BoardService {
	static async getAll(projectId: string): Promise<Board[]> {
		const response = await $api.get<Board[]>(
			`/user/project/${projectId}/board/allBoards`
		);
		return response.data;
	}

	static async create(projectId: string, data: BoardDto): Promise<Board> {
		const response = await $api.post<Board>(
			`/user/project/${projectId}/board`,
			data
		);
		return response.data;
	}

	static async update(
		projectId: string,
		boardId: string,
		data: BoardDto
	): Promise<Board> {
		const response = await $api.put<Board>(
			`/user/project/${projectId}/board/${boardId}`,
			data
		);
		return response.data;
	}

	static async delete(projectId: string, boardId: string): Promise<void> {
		await $api.delete(`/user/project/${projectId}/board/${boardId}`);
	}
}
