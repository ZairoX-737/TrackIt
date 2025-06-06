import { useState, useEffect } from 'react';
import { IoClose, IoCopy } from 'react-icons/io5';
import { FiUsers, FiUserPlus, FiXCircle } from 'react-icons/fi';
import { UserOnProjectService, ProjectUser } from '../api';

interface ProjectUsersModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
	projectName: string;
}

export default function ProjectUsersModal({
	isOpen,
	onClose,
	projectId,
	projectName,
}: ProjectUsersModalProps) {
	const [users, setUsers] = useState<ProjectUser[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [inviteEmail, setInviteEmail] = useState('');
	const [inviteRole, setInviteRole] = useState<'admin' | 'editor'>('editor');
	const [inviting, setInviting] = useState(false);

	// Load users when modal opens
	useEffect(() => {
		if (isOpen && projectId) {
			loadUsers();
		}
	}, [isOpen, projectId]);

	const loadUsers = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await UserOnProjectService.getProjectUsers(projectId);
			setUsers(data);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to load users');
		} finally {
			setLoading(false);
		}
	};
	const handleInviteUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!inviteEmail.trim()) return;

		try {
			setInviting(true);
			setError(null);
			console.log(
				'Inviting user to project:',
				projectId,
				inviteEmail.trim(),
				inviteRole
			);
			const newUser = await UserOnProjectService.inviteUser(
				projectId,
				inviteEmail.trim(),
				inviteRole
			);
			console.log('User invited successfully:', newUser);
			setUsers([...users, newUser]);
			setInviteEmail('');
			setInviteRole('editor');
		} catch (err: any) {
			console.error('Error inviting user:', err);
			setError(err.response?.data?.message || 'Failed to invite user');
		} finally {
			setInviting(false);
		}
	};

	const handleRemoveUser = async (userId: string) => {
		try {
			setError(null);
			await UserOnProjectService.removeUser(userId, projectId);
			setUsers(users.filter(user => user.userId !== userId));
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to remove user');
		}
	};
	if (!isOpen) return null;
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2100]'
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
					{error && (
						<div className='mb-4 p-3 bg-red-600 text-white rounded-md'>
							{error}
						</div>
					)}

					{/* Invite Users */}
					<div className='mb-6 bg-[#3c3c3e] p-4 rounded-lg'>
						<h3 className='text-lg font-medium mb-3 flex items-center gap-2'>
							<FiUserPlus size={18} />
							Invite Users
						</h3>
						<form onSubmit={handleInviteUser} className='flex flex-col gap-3'>
							<div className='flex gap-2'>
								<input
									type='email'
									value={inviteEmail}
									onChange={e => setInviteEmail(e.target.value)}
									placeholder='Enter user email'
									className='bg-[#252528] text-white px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
									required
								/>
								<select
									value={inviteRole}
									onChange={e =>
										setInviteRole(e.target.value as 'admin' | 'editor')
									}
									className='bg-[#252528] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
								>
									<option value='editor'>Editor</option>
									<option value='admin'>Admin</option>
								</select>
								<button
									type='submit'
									disabled={inviting || !inviteEmail.trim()}
									className='bg-[#ff9800] hover:bg-[#f57c00] disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md'
								>
									{inviting ? 'Inviting...' : 'Invite'}
								</button>
							</div>
						</form>
					</div>

					{/* Users List */}
					<div>
						<h3 className='text-lg font-medium mb-3'>Project Members</h3>
						{loading ? (
							<div className='text-center py-4'>Loading users...</div>
						) : (
							<div className='space-y-2'>
								{users.map(user => (
									<div
										key={user.userId}
										className='flex items-center justify-between bg-[#3c3c3e] p-3 rounded-md'
									>
										<div className='flex items-center gap-3'>
											<div className='w-10 h-10 bg-[#4c4c4e] rounded-full flex items-center justify-center text-lg font-semibold'>
												{user.user.username
													? user.user.username.charAt(0).toUpperCase()
													: user.user.email.charAt(0).toUpperCase()}
											</div>
											<div>
												<div className='font-medium'>
													{user.user.username || user.user.email}
												</div>
												<div className='text-sm text-gray-400'>
													{user.user.email}
												</div>
											</div>
										</div>
										<div className='flex items-center gap-3'>
											<span
												className={`text-sm px-2 py-1 rounded ${
													user.role === 'admin'
														? 'bg-[#ff9800] text-white'
														: 'bg-[#60a5fa] text-white'
												}`}
											>
												{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
											</span>
											{user.role !== 'admin' && (
												<button
													onClick={() => handleRemoveUser(user.userId)}
													className='text-gray-400 hover:text-red-500'
													title='Remove user'
												>
													<FiXCircle size={18} />
												</button>
											)}
										</div>
									</div>
								))}
								{users.length === 0 && !loading && (
									<div className='text-center py-4 text-gray-400'>
										No users in this project yet
									</div>
								)}
							</div>
						)}
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
