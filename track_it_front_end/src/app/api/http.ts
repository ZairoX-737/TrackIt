import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '@/config/config';

export const API_URL = API_CONFIG.API_URL;

const $api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

// Интерцептор для добавления токена авторизации
$api.interceptors.request.use(config => {
	const token = Cookies.get('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Интерцептор для обработки ошибок авторизации
$api.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config;

		// Не обрабатываем 401 ошибки для эндпоинтов авторизации
		if (
			error.response?.status === 401 &&
			!originalRequest._isRetry &&
			!originalRequest.url?.includes('/auth/login') &&
			!originalRequest.url?.includes('/auth/register')
		) {
			originalRequest._isRetry = true;
			try {
				const response = await axios.post(
					`${API_URL}/auth/login/access-token`,
					{},
					{
						withCredentials: true,
					}
				);

				if (response.data.accessToken) {
					Cookies.set('accessToken', response.data.accessToken);
					return $api.request(originalRequest);
				}
			} catch (e) {
				// Если обновление токена не удалось, перенаправляем на логин
				// только если мы не на странице авторизации
				Cookies.remove('accessToken');
				if (!window.location.pathname.includes('/auth/')) {
					window.location.href = '/auth/login';
				}
			}
		}

		throw error;
	}
);

export default $api;
