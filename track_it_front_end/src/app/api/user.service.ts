import $api from './http';
import { User, UserDto } from './types';

export class UserService {
	static async getProfile(): Promise<User> {
		const response = await $api.get<User>('/user/profile');
		return response.data;
	}

	static async updateProfile(data: UserDto): Promise<User> {
		const response = await $api.put<User>('/user/profile', data);
		return response.data;
	}

	static async getAllUsers(): Promise<User[]> {
		const response = await $api.get<User[]>('/user/profile/allUsers');
		return response.data;
	}
}
