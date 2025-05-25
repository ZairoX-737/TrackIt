import apiClient from './http';

export interface ProjectUser {
	userId: string;
	projectId: string;
	role: 'admin' | 'editor';
	user: {
		id: string;
		username: string;
		email: string;
	};
}

export const UserOnProjectService = {
	async getProjectUsers(projectId: string): Promise<ProjectUser[]> {
		const response = await apiClient.get(
			`/user-on-project/project/${projectId}`
		);
		return response.data;
	},

	async inviteUser(
		projectId: string,
		email: string,
		role: 'admin' | 'editor' = 'editor'
	): Promise<ProjectUser> {
		const response = await apiClient.post('/user-on-project/invite', {
			projectId,
			email,
			role,
		});
		return response.data;
	},

	async removeUser(userId: string, projectId: string): Promise<void> {
		await apiClient.delete(`/user-on-project/${userId}/${projectId}`);
	},
};
