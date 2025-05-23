import { useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

export const useInitializeApp = () => {
	const {
		checkAuth,
		loadUserProfile,
		loadProjects,
		clearStore,
		loading,
		error,
	} = useTaskStore();

	useEffect(() => {
		const initializeApp = async () => {
			// Проверяем авторизацию
			if (!checkAuth()) {
				clearStore();
				return;
			}

			try {
				// Загружаем данные пользователя и проекты
				await Promise.all([loadUserProfile(), loadProjects()]);
			} catch (error) {
				console.error('Error initializing app:', error);
				// При ошибке авторизации очищаем store
				clearStore();
			}
		};

		initializeApp();
	}, [checkAuth, loadUserProfile, loadProjects, clearStore]);

	return { loading, error };
};
