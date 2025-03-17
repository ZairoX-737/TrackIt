import { useState } from 'react';
import { IoClose, IoCopy } from 'react-icons/io5';
import { FiUsers, FiUserPlus, FiXCircle } from 'react-icons/fi';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'editor' | 'viewer';
	avatarUrl?: string;
}

interface ProjectUsersModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectName: string;
}

export default function ProjectUsersModal({
	isOpen,
	onClose,
	projectName,
}: ProjectUsersModalProps) {
	const [inviteLink, setInviteLink] = useState('');
	const [inviteLinkGenerated, setInviteLinkGenerated] = useState(false);

	// Mock user data
	const [users, setUsers] = useState<User[]>([
		{
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			role: 'admin',
			avatarUrl: 'https://i.pravatar.cc/150?img=1',
		},
		{
			id: '2',
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'editor',
			avatarUrl: 'https://i.pravatar.cc/150?img=5',
		},
		{
			id: '3',
			name: 'Mike Johnson',
			email: 'mike@example.com',
			role: 'viewer',
			avatarUrl: 'https://i.pravatar.cc/150?img=8',
		},
	]);

	if (!isOpen) return null;

	const generateInviteLink = () => {
		const link = `https://trackit.app/invite/${projectName
			.toLowerCase()
			.replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 10)}`;
		setInviteLink(link);
		setInviteLinkGenerated(true);
	};

	const copyInviteLink = () => {
		navigator.clipboard.writeText(inviteLink);
		// You could add a toast notification here
	};

	const removeUser = (userId: string) => {
		setUsers(users.filter(user => user.id !== userId));
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[600px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<div className='flex items-center gap-2'>
						<FiUsers size={20} />
						<h2 className='text-xl font-semibold'>Project Users</h2>
					</div>
					<button onClick={onClose}>
						<IoClose size={24} className='text-gray-400 hover:text-white' />
					</button>
				</div>

				<div className='p-4 overflow-y-auto max-h-[calc(80vh-120px)]'>
					{/* Invite Users */}
					<div className='mb-6 bg-[#3c3c3e] p-4 rounded-lg'>
						<h3 className='text-lg font-medium mb-3 flex items-center gap-2'>
							<FiUserPlus size={18} />
							Invite Users
						</h3>
						<div className='flex flex-col gap-3'>
							{!inviteLinkGenerated ? (
								<button
									onClick={generateInviteLink}
									className='bg-[#ff9800] hover:bg-[#f57c00] text-white px-4 py-2 rounded-md'
								>
									Generate Invite Link
								</button>
							) : (
								<>
									<div className='flex'>
										<input
											type='text'
											value={inviteLink}
											readOnly
											className='bg-[#252528] text-white px-3 py-2 rounded-l-md w-full focus:outline-none'
										/>
										<button
											onClick={copyInviteLink}
											className='bg-[#4c4c4e] hover:bg-[#5c5c5e] px-3 py-2 rounded-r-md'
											title='Copy to clipboard'
										>
											<IoCopy size={18} />
										</button>
									</div>
									<div className='text-sm text-gray-400'>
										Anyone with this link can join the project. The link will
										expire in 7 days.
									</div>
								</>
							)}
						</div>
					</div>

					{/* Users List */}
					<div>
						<h3 className='text-lg font-medium mb-3'>Project Members</h3>
						<div className='space-y-2'>
							{users.map(user => (
								<div
									key={user.id}
									className='flex items-center justify-between bg-[#3c3c3e] p-3 rounded-md'
								>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 bg-[#4c4c4e] rounded-full overflow-hidden'>
											{user.avatarUrl ? (
												<img
													src='/api/placeholder/40/40'
													alt={user.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-lg font-semibold'>
													{user.name.charAt(0)}
												</div>
											)}
										</div>
										<div>
											<div className='font-medium'>{user.name}</div>
											<div className='text-sm text-gray-400'>{user.email}</div>
										</div>
									</div>
									<div className='flex items-center gap-3'>
										<span
											className={`text-sm px-2 py-1 rounded ${
												user.role === 'admin'
													? 'bg-[#ff9800] text-white'
													: user.role === 'editor'
													? 'bg-[#60a5fa] text-white'
													: 'bg-[#4c4c4e] text-white'
											}`}
										>
											{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
										</span>
										{user.role !== 'admin' && (
											<button
												onClick={() => removeUser(user.id)}
												className='text-gray-400 hover:text-red-500'
												title='Remove user'
											>
												<FiXCircle size={18} />
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className='flex justify-end p-4 border-t border-[#3c3c3e]'>
					<button
						onClick={onClose}
						className='px-4 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded-md'
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
