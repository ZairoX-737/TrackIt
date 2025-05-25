import apiClient from './http';

export interface Comment {
	id: string;
	content: string;
	createdAt: string;
	userId: string;
	taskId: string;
	user: {
		id: string;
		username: string;
		email: string;
	};
}

export const CommentService = {
	async getTaskComments(taskId: string): Promise<Comment[]> {
		const response = await apiClient.get(`/comment/task/${taskId}`);
		return response.data;
	},

	async createComment(taskId: string, content: string): Promise<Comment> {
		const response = await apiClient.post('/comment', {
			taskId,
			content,
		});
		return response.data;
	},

	async deleteComment(commentId: string): Promise<void> {
		await apiClient.delete(`/comment/${commentId}`);
	},
};
