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
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2100]'
			onClick={onClose}
		>
			<div
				className='bg-[rgba(10,10,10,0.95)] w-[700px] max-h-[85vh] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-6 pb-4'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 bg-[rgba(139,92,246,0.15)] rounded-xl'>
							<FiUsers className='text-purple-400' size={20} />
						</div>
						<div>
							<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
								Project Users
							</h2>
							<p className='text-sm text-[rgba(255,255,255,0.6)]'>
								{projectName}
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105'
					>
						<IoClose size={20} />
					</button>
				</div>

				<div className='px-6 pb-6 overflow-y-auto max-h-[calc(85vh-140px)] custom-scrollbar'>
					{/* Error Message */}
					{error && (
						<div className='mb-6 p-4 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-xl backdrop-blur-sm'>
							<div className='flex items-center gap-2 text-red-400'>
								<FiXCircle size={16} />
								<span className='font-medium'>{error}</span>
							</div>
						</div>
					)}

					{/* Invite Users Section */}
					<div className='mb-8 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] p-5 rounded-2xl'>
						<h3 className='text-lg font-semibold mb-4 flex items-center gap-3'>
							<div className='p-2 bg-[rgba(34,197,94,0.15)] rounded-lg'>
								<FiUserPlus className='text-green-400' size={18} />
							</div>
							<span className='text-white'>Invite New User</span>
						</h3>

						<form onSubmit={handleInviteUser} className='space-y-4'>
							<div className='flex gap-3'>
								<div className='flex-1'>
									<input
										type='email'
										value={inviteEmail}
										onChange={e => setInviteEmail(e.target.value)}
										placeholder='Enter user email address'
										className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 placeholder-[rgba(255,255,255,0.4)]'
										required
									/>
								</div>
								<select
									value={inviteRole}
									onChange={e =>
										setInviteRole(e.target.value as 'admin' | 'editor')
									}
									className='bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-400 min-w-[120px]'
								>
									<option value='editor' className='bg-gray-800'>
										Editor
									</option>
									<option value='admin' className='bg-gray-800'>
										Admin
									</option>
								</select>
								<button
									type='submit'
									disabled={inviting || !inviteEmail.trim()}
									className='px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 shadow-lg min-w-[100px]'
								>
									{inviting ? 'Inviting...' : 'Invite'}
								</button>
							</div>
						</form>
					</div>

					{/* Users List Section */}
					<div>
						<h3 className='text-lg font-semibold mb-4 flex items-center gap-3'>
							<div className='p-2 bg-[rgba(255,152,0,0.15)] rounded-lg'>
								<FiUsers className='text-orange-400' size={18} />
							</div>
							<span className='text-white'>Project Members</span>
							<span className='text-sm text-[rgba(255,255,255,0.5)] bg-[rgba(255,255,255,0.1)] px-2 py-1 rounded-full'>
								{users.length}
							</span>
						</h3>

						{loading ? (
							<div className='text-center py-12'>
								<div className='inline-flex items-center gap-3 text-[rgba(255,255,255,0.7)]'>
									<div className='w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin'></div>
									Loading users...
								</div>
							</div>
						) : (
							<div className='space-y-3'>
								{users.map(user => (
									<div
										key={user.userId}
										className='flex items-center justify-between bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] p-4 rounded-xl hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.2)] transition-all duration-200'
									>
										<div className='flex items-center gap-4'>
											<div className='w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg'>
												{user.user.username
													? user.user.username.charAt(0).toUpperCase()
													: user.user.email.charAt(0).toUpperCase()}
											</div>
											<div>
												<div className='font-semibold text-white'>
													{user.user.username || user.user.email}
												</div>
												<div className='text-sm text-[rgba(255,255,255,0.6)]'>
													{user.user.email}
												</div>
											</div>
										</div>

										<div className='flex items-center gap-3'>
											<span
												className={`text-sm px-3 py-1.5 rounded-full font-medium ${
													user.role === 'admin'
														? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
														: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
												}`}
											>
												{user.role.charAt(0).toUpperCase() + user.role.slice(1)}
											</span>
											{user.role !== 'admin' && (
												<button
													onClick={() => handleRemoveUser(user.userId)}
													className='text-[rgba(255,255,255,0.5)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] p-2 rounded-lg transition-all duration-200'
													title='Remove user from project'
												>
													<FiXCircle size={18} />
												</button>
											)}
										</div>
									</div>
								))}

								{users.length === 0 && !loading && (
									<div className='text-center py-12'>
										<div className='w-16 h-16 bg-[rgba(255,255,255,0.05)] rounded-2xl flex items-center justify-center mx-auto mb-4'>
											<FiUsers
												className='text-[rgba(255,255,255,0.3)]'
												size={32}
											/>
										</div>
										<p className='text-[rgba(255,255,255,0.6)] mb-2'>
											No team members yet
										</p>
										<p className='text-sm text-[rgba(255,255,255,0.4)]'>
											Invite users to start collaborating
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div className='flex justify-end p-6 pt-4 border-t border-[rgba(255,255,255,0.1)]'>
					<button
						onClick={onClose}
						className='px-6 py-2.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200'
					>
						Close
					</button>
				</div>
			</div>

			{/* Custom scrollbar styles */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.2);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.3);
				}
			`}</style>
		</div>
	);
}
