import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';

export interface Notification {
	id: string;
	message: string;
	type: string;
	isRead: boolean;
	createdAt: string;
	entityId?: string;
	entityType?: string;
	triggeredByUser?: {
		id: string;
		username: string;
	};
}

export interface NotificationEvent {
	notifications: Notification[];
	count: number;
}

export const useSocket = (projectId?: string) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [isConnected, setIsConnected] = useState(false);
	const { user } = useAuth();
	const socketRef = useRef<Socket | null>(null);
	const [token, setToken] = useState<string | null>(null);
	// Отслеживаем изменения токена
	useEffect(() => {
		const currentToken = Cookies.get('accessToken');
		setToken(currentToken || null);

		// Устанавливаем интервал для проверки обновления токена
		const tokenCheckInterval = setInterval(() => {
			const newToken = Cookies.get('accessToken');
			if (newToken !== token) {
				setToken(newToken || null);
			}
		}, 5000); // Проверяем каждые 5 секунд

		return () => clearInterval(tokenCheckInterval);
	}, [token]);

	useEffect(() => {
		if (!user || !projectId || !token) {
			return;
		}

		// Создаем соединение с WebSocket сервером
		const newSocket = io(`http://localhost:4200/notifications`, {
			auth: {
				token: token,
			},
			transports: ['websocket'],
		});
		socketRef.current = newSocket;
		setSocket(newSocket);

		// Обработчики событий
		newSocket.on('connect', () => {
			setIsConnected(true);

			// Присоединяемся к проекту
			newSocket.emit('joinProject', {
				projectId,
				userId: user.id,
				token,
			});
		});
		newSocket.on('disconnect', () => {
			setIsConnected(false);
		});

		newSocket.on('connect_error', error => {
			console.error('WebSocket connection error:', error);
			setIsConnected(false);
		}); // Получение непрочитанных уведомлений при подключении
		newSocket.on('unreadNotifications', (data: NotificationEvent) => {
			// Дедупликация уведомлений по ID
			const uniqueNotifications = data.notifications.filter(
				(notification, index, self) =>
					index === self.findIndex(n => n.id === notification.id)
			);

			setNotifications(uniqueNotifications);
			setUnreadCount(data.count);
		}); // Новое уведомление
		newSocket.on('newNotification', (notification: Notification) => {
			// Проверяем, нет ли уже такого уведомления (дедупликация)
			setNotifications(prev => {
				const exists = prev.some(n => n.id === notification.id);
				if (exists) {
					return prev;
				}
				return [notification, ...prev];
			});

			setUnreadCount(prev => prev + 1);
		}); // Обновление счетчика уведомлений
		newSocket.on('notificationCountUpdate', (data: { count: number }) => {
			setUnreadCount(data.count);
		}); // Уведомление помечено как прочитанное
		newSocket.on(
			'notificationMarkedAsRead',
			(data: { notificationId: string }) => {
				setNotifications(prev =>
					prev.map(notification =>
						notification.id === data.notificationId
							? { ...notification, isRead: true }
							: notification
					)
				);
				setUnreadCount(prev => Math.max(0, prev - 1));
			}
		);

		// Все уведомления помечены как прочитанные
		newSocket.on('allNotificationsMarkedAsRead', (data: { count: number }) => {
			setNotifications(prev =>
				prev.map(notification => ({ ...notification, isRead: true }))
			);
			setUnreadCount(0);
		}); // Ошибки
		newSocket.on('error', (error: Error | string | any) => {
			console.error('❌ Socket error:', error);
		}); // Обработка истекшего токена
		newSocket.on('tokenExpired', async () => {
			setIsConnected(false);

			try {
				// Попытаемся обновить токен через HTTP интерцептор
				const testRequest = await fetch(
					`${
						process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api'
					}/user/profile`,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);

				// Если запрос прошел успешно, токен мог быть обновлен HTTP интерцептором
				if (testRequest.ok || testRequest.status !== 401) {
					setTimeout(() => {
						const newToken = Cookies.get('accessToken');
						if (newToken && newToken !== token) {
							setToken(newToken);
							// useEffect перезапустится и переподключит WebSocket
						}
					}, 1000);
				} else {
					// Токен не удалось обновить, отключаемся
					newSocket.disconnect();
				}
			} catch (error) {
				// Ошибка при попытке обновления токена
				newSocket.disconnect();
			}
		});

		// Обработка ошибок авторизации
		newSocket.on('authError', () => {
			setIsConnected(false);
			// При ошибке авторизации отключаемся и не переподключаемся
			newSocket.disconnect();
		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, [user, projectId, token]);
	// Методы для работы с уведомлениями
	const markAsRead = (notificationId: string) => {
		if (socket) {
			socket.emit('markAsRead', { notificationId });
		}
	};

	const markAllAsRead = () => {
		if (socket && projectId) {
			socket.emit('markAllAsRead', { projectId });
		}
	};

	const leaveProject = () => {
		if (socket && projectId) {
			socket.emit('leaveProject', { projectId });
		}
	};
	return {
		socket,
		notifications,
		unreadCount,
		isConnected,
		markAsRead,
		markAllAsRead,
		leaveProject,
	};
};
