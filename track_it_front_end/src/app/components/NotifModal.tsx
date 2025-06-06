import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

import styles from './Components.module.scss';

interface Notification {
	id: string;
	message: string;
	timestamp: Date;
}

export default function NotificationsModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: '1',
			message: 'John added a new board "Marketing Q3"',
			timestamp: new Date(),
		},
		{
			id: '2',
			message: 'Sara moved task "Update website" to Done',
			timestamp: new Date(Date.now() - 3600000),
		},
		{
			id: '3',
			message: 'Mike invited you to project "Website Redesign"',
			timestamp: new Date(Date.now() - 86400000),
		},
		{
			id: '4',
			message: 'Task "Create wireframes" is due tomorrow',
			timestamp: new Date(Date.now() - 172800000),
		},
		{
			id: '5',
			message: 'New comment on task "Fix login page"',
			timestamp: new Date(Date.now() - 259200000),
		},
	]);

	const removeNotification = (id: string) => {
		setNotifications(
			notifications.filter(notification => notification.id !== id)
		);
	};

	if (!isOpen) return null;

	return (
		<div
			className='absolute top-11 right-1 bg-[#2c2c2e] w-80 max-h-96 rounded-md shadow-lg border border-[#3c3c3e] z-[2000]'
			onClick={e => e.stopPropagation()}
		>
			<div className='flex justify-between items-center p-3 border-b border-[#3c3c3e]'>
				<h3 className='text-lg font-semibold'>Notifications</h3>
				<button onClick={onClose} className='text-gray-400 hover:text-white'>
					<IoClose size={20} />
				</button>
			</div>

			<div className={styles.notification}>
				{notifications.length > 0 ? (
					notifications.map(notification => (
						<div
							key={notification.id}
							className={`flex items-start p-3 border-b border-[#3c3c3e]`}
						>
							<div className='flex-grow'>
								<p className='text-sm'>{notification.message}</p>
								<p className='text-xs text-gray-400 mt-1'>
									{notification.timestamp.toLocaleTimeString([], {
										hour: '2-digit',
										minute: '2-digit',
									})}
								</p>
							</div>
							<button
								onClick={() => removeNotification(notification.id)}
								className='ml-2 bg-white rounded-full p-1 flex items-center justify-center'
							>
								<IoClose size={12} className='text-black' />
							</button>
						</div>
					))
				) : (
					<div className='p-4 text-center text-gray-400'>No notifications</div>
				)}
			</div>
		</div>
	);
}
