'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSocket, Notification } from '../../hooks/useSocket';
import styles from './NotificationBell.module.scss';

interface NotificationBellProps {
	projectId?: string;
	className?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
	projectId,
	className,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { notifications, unreadCount, markAsRead, markAllAsRead } =
		useSocket(projectId);
	const dropdownRef = useRef<HTMLDivElement>(null);
	// Закрытие dropdown при клике вне
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleNotificationClick = (notification: Notification) => {
		if (!notification.isRead) {
			markAsRead(notification.id);
		}
	};
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return 'now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	};
	const handleViewAll = () => {
		console.log('View All clicked, projectId:', projectId);
		// Отмечаем все уведомления как прочитанные
		if (markAllAsRead) {
			markAllAsRead();
			console.log('markAllAsRead called');
		} else {
			console.log('markAllAsRead is not available');
		}
		setIsOpen(false);
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'TASK_CREATED':
			case 'TASK_UPDATED':
			case 'TASK_DELETED':
				return '📋';
			case 'COMMENT_CREATED':
				return '💬';
			case 'BOARD_CREATED':
			case 'BOARD_UPDATED':
			case 'BOARD_DELETED':
				return '📊';
			case 'COLUMN_CREATED':
			case 'COLUMN_UPDATED':
			case 'COLUMN_DELETED':
				return '📝';
			case 'USER_JOINED_PROJECT':
			case 'USER_LEFT_PROJECT':
				return '👤';
			default:
				return '🔔';
		}
	};

	return (
		<div
			className={`${styles.notificationBell} ${className || ''}`}
			ref={dropdownRef}
		>
			{' '}
			<button
				className={styles.bellButton}
				onClick={() => setIsOpen(!isOpen)}
				aria-label='Notifications'
			>
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
					className={styles.bellIcon}
				>
					<path
						d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
					<path
						d='M13.73 21a2 2 0 0 1-3.46 0'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					/>
				</svg>
				{unreadCount > 0 && (
					<span className={styles.badge}>
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
			</button>
			{isOpen && (
				<div className={styles.dropdown}>
					<div className={styles.header}>
						<h3>Notifications</h3>
						{unreadCount > 0 && (
							<span className={styles.unreadCount}>{unreadCount} unread</span>
						)}
					</div>
					<div className={styles.notificationsList}>
						{' '}
						{notifications.length === 0 ? (
							<div className={styles.emptyState}>
								<span>🔕</span>
								<p>No notifications</p>
							</div>
						) : (
							notifications.map(notification => (
								<div
									key={notification.id}
									className={`${styles.notificationItem} ${
										!notification.isRead ? styles.unread : ''
									}`}
									onClick={() => handleNotificationClick(notification)}
								>
									<div className={styles.notificationIcon}>
										{getNotificationIcon(notification.type)}
									</div>
									<div className={styles.notificationContent}>
										<p className={styles.message}>{notification.message}</p>
										<div className={styles.meta}>
											<span className={styles.time}>
												{formatTime(notification.createdAt)}
											</span>{' '}
											{notification.triggeredByUser && (
												<span className={styles.user}>
													by {notification.triggeredByUser.username}
												</span>
											)}
										</div>
									</div>
									{!notification.isRead && (
										<div className={styles.unreadDot}></div>
									)}
								</div>
							))
						)}
					</div>{' '}
					{notifications.length > 0 && (
						<div className={styles.footer}>
							<button className={styles.viewAllButton} onClick={handleViewAll}>
								{unreadCount > 0 ? `Mark ${unreadCount} as read` : 'All read'}
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default NotificationBell;
