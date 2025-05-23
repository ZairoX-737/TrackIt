import $api from './http';
import { Project, ProjectDto } from './types';

export class ProjectService {
	static async getAll(): Promise<Project[]> {
		const response = await $api.get<Project[]>('/user/project/allProjects');
		return response.data;
	}

	static async getAllDetailed(): Promise<Project[]> {
		const response = await $api.get<Project[]>(
			'/user/project/allProjectsDetailed'
		);
		return response.data;
	}

	static async create(data: ProjectDto): Promise<Project> {
		const response = await $api.post<Project>('/user/project', data);
		return response.data;
	}

	static async connectToProject(projectId: string): Promise<void> {
		await $api.post(`/user/project/connect/${projectId}`);
	}

	static async disconnectFromProject(projectId: string): Promise<void> {
		await $api.post(`/user/project/disconnect/${projectId}`);
	}
}
