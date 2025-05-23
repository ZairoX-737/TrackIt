import $api from './http';
import { Task, TaskDto } from './types';

export class TaskService {
	static async getAll(): Promise<Task[]> {
		const response = await $api.get<Task[]>('/user/task/allTasks');
		return response.data;
	}

	static async getCompletedTasks(): Promise<Task[]> {
		const response = await $api.get<Task[]>('/user/task/completedTasks');
		return response.data;
	}

	static async create(columnId: string, data: TaskDto): Promise<Task> {
		const response = await $api.post<Task>(`/user/task/${columnId}`, data);
		return response.data;
	}

	static async update(taskId: string, data: TaskDto): Promise<Task> {
		const response = await $api.put<Task>(`/user/task/${taskId}`, data);
		return response.data;
	}

	static async delete(taskId: string): Promise<void> {
		await $api.delete(`/user/task/${taskId}`);
	}
}
