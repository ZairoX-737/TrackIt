import { useState } from 'react';
import {
	IoClose,
	IoNotificationsOutline,
	IoTimeOutline,
	IoPersonOutline,
	IoFolderOutline,
	IoDocumentTextOutline,
	IoCheckmarkCircleOutline,
} from 'react-icons/io5';

interface Notification {
	id: string;
	message: string;
	timestamp: Date;
	type: 'project' | 'task' | 'comment' | 'general';
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
			type: 'project',
		},
		{
			id: '2',
			message: 'Sara moved task "Update website" to Done',
			timestamp: new Date(Date.now() - 3600000),
			type: 'task',
		},
		{
			id: '3',
			message: 'Mike invited you to project "Website Redesign"',
			timestamp: new Date(Date.now() - 86400000),
			type: 'project',
		},
		{
			id: '4',
			message: 'Task "Create wireframes" is due tomorrow',
			timestamp: new Date(Date.now() - 172800000),
			type: 'task',
		},
		{
			id: '5',
			message: 'New comment on task "Fix login page"',
			timestamp: new Date(Date.now() - 259200000),
			type: 'comment',
		},
	]);

	const removeNotification = (id: string) => {
		setNotifications(
			notifications.filter(notification => notification.id !== id)
		);
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'project':
				return <IoFolderOutline className='text-blue-400' size={16} />;
			case 'task':
				return <IoDocumentTextOutline className='text-green-400' size={16} />;
			case 'comment':
				return <IoPersonOutline className='text-purple-400' size={16} />;
			default:
				return <IoNotificationsOutline className='text-orange-400' size={16} />;
		}
	};

	const getTimeAgo = (timestamp: Date) => {
		const now = new Date();
		const diffInMinutes = Math.floor(
			(now.getTime() - timestamp.getTime()) / (1000 * 60)
		);

		if (diffInMinutes < 1) return 'just now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		return `${diffInDays}d ago`;
	};

	if (!isOpen) return null;
	return (
		<div
			className='absolute top-11 right-1 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] w-96 rounded-2xl shadow-2xl z-[2000] overflow-hidden flex flex-col max-h-96'
			onClick={e => e.stopPropagation()}
		>
			{/* Header */}
			<div className='flex justify-between items-center p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex-shrink-0'>
				<div className='flex items-center gap-3'>
					<div className='p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl'>
						<IoNotificationsOutline className='text-orange-400' size={18} />
					</div>
					<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
						Notifications
					</h3>
				</div>
				<button
					onClick={onClose}
					className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105'
				>
					<IoClose size={20} />
				</button>
			</div>

			{/* Notifications List */}
			<div className='overflow-y-auto custom-scrollbar flex-1 min-h-0'>
				{notifications.length > 0 ? (
					<div className='p-2'>
						{notifications.map((notification, index) => (
							<div
								key={notification.id}
								className={`
									flex items-start gap-3 p-4 mx-2 mb-2 rounded-xl 
									bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] 
									hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200 
									backdrop-blur-sm group
								`}
							>
								<div className='flex-shrink-0 mt-0.5'>
									{getNotificationIcon(notification.type)}
								</div>
								<div className='flex-grow min-w-0'>
									<p className='text-sm text-[rgba(255,255,255,0.9)] leading-relaxed'>
										{notification.message}
									</p>
									<div className='flex items-center gap-2 mt-2 text-xs text-[rgba(255,255,255,0.5)]'>
										<IoTimeOutline size={12} />
										{getTimeAgo(notification.timestamp)}
									</div>
								</div>
								<button
									onClick={() => removeNotification(notification.id)}
									className='flex-shrink-0 text-[rgba(255,255,255,0.3)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100'
									title='Dismiss notification'
								>
									<IoClose size={14} />
								</button>
							</div>
						))}
					</div>
				) : (
					<div className='p-12 text-center'>
						<div className='mb-4'>
							<IoCheckmarkCircleOutline
								className='mx-auto text-[rgba(255,255,255,0.3)]'
								size={48}
							/>
						</div>
						<p className='text-[rgba(255,255,255,0.5)] font-medium'>
							All caught up!
						</p>
						<p className='text-[rgba(255,255,255,0.3)] text-sm mt-1'>
							No new notifications
						</p>
					</div>
				)}
			</div>

			{/* Footer */}
			{notifications.length > 0 && (
				<div className='p-4 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex-shrink-0'>
					<button
						onClick={() => setNotifications([])}
						className='w-full px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.7)] hover:text-white bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-xl transition-all duration-200'
					>
						Clear all notifications
					</button>
				</div>
			)}

			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 153, 0, 0.4);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 153, 0, 0.6);
				}
			`}</style>
		</div>
	);
}
