import api from './http';
import type { AuthDto, RegisterDto, AuthResponse } from './types';

export const AuthService = {
	async login(data: AuthDto): Promise<AuthResponse> {
		// Добавляем username, если его нет (бэкенд требует это поле для валидации, хотя не использует)
		const loginData = {
			...data,
			username: data.username || 'user', // добавляем дефолтное значение, если username не предоставлен
		};

		const response = await api.post('/auth/login', loginData);
		return response.data;
	},

	async register(data: RegisterDto): Promise<AuthResponse> {
		const response = await api.post('/auth/register', data);
		return response.data;
	},

	async logout(): Promise<void> {
		await api.post('/auth/logout');
	},

	async me(): Promise<AuthResponse> {
		// Изменяем на вызов user/profile вместо auth/me, так как судя по всему
		// этот эндпоинт используется для получения данных профиля
		const response = await api.get('/user/profile');
		return response.data;
	},
};
