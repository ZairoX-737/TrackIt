'use client';
import { useTaskStore } from '../store/taskStore';
import { useInitializeApp } from '../hooks/useInitializeApp';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../api';
import { Comment } from '../api/comment.service';
import Cookies from 'js-cookie';
import Image from 'next/image';
import WLogo from '../../public/logo-white.png';
import styles from './Profile.module.scss';
import {
	IoPersonOutline,
	IoFolderOutline,
	IoChatbubbleOutline,
	IoCalendarOutline,
	IoLogOutOutline,
	IoStatsChartOutline,
	IoGridOutline,
	IoArrowForwardOutline,
} from 'react-icons/io5';

export default function UserProfile() {
	const { loading, error } = useInitializeApp();
	const { user, projects, handleModalSelection } = useTaskStore();
	const [selectedProjectName, setSelectedProjectName] = useState<string>('');
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			Cookies.remove('accessToken');
			router.push('/auth/login');
		}
	};
	if (loading) {
		return (
			<div className={styles.container}>
				{/* Background Elements */}
				<div className={styles.backgroundElements}>
					<div className={styles.gridPattern}></div>
				</div>
				<div className={styles.loadingScreen}>
					<div className={styles.loadingContent}>
						<div className={styles.loadingSpinner}></div>
						<span className={styles.loadingText}>Loading your profile...</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
				<div className='bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 p-6 rounded-xl backdrop-blur-sm'>
					<h2 className='text-xl font-semibold mb-2'>Error Loading Profile</h2>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
				<div className='bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 p-6 rounded-xl backdrop-blur-sm'>
					<h2 className='text-xl font-semibold mb-2'>User Not Found</h2>
					<p>Unable to load user information</p>
				</div>
			</div>
		);
	}

	// Подсчитываем статистику
	// Проекты, где пользователь является создателем
	const userProjects = projects.filter(p => p.createdBy === user.id);
	// Проекты, где пользователь является участником, но не создателем
	const foreignProjects = projects.filter(
		p =>
			p.createdBy !== user.id &&
			p.users?.some(projectUser => projectUser.userId === user.id)
	);
	const allComments = projects.reduce((acc, project) => {
		return (
			acc +
			(project.boards?.reduce((boardAcc, board) => {
				return (
					boardAcc +
					(board.columns?.reduce((colAcc, column) => {
						return (
							colAcc +
							(column.tasks?.reduce((taskAcc, task) => {
								// Считаем только комментарии текущего пользователя
								return (
									taskAcc +
									(task.comments?.filter(
										comment => comment.user?.id === user.id
									).length || 0)
								);
							}, 0) || 0)
						);
					}, 0) || 0)
				);
			}, 0) || 0)
		);
	}, 0);

	// Получаем доски выбранного проекта
	const selectedProject = projects.find(p => p.name === selectedProjectName);
	const selectedProjectBoards = selectedProject?.boards || [];

	// Функция для обработки клика по доске
	const handleBoardClick = async (board: any) => {
		if (selectedProject) {
			await handleModalSelection(selectedProject, board);
			router.push('/tasks');
		}
	};
	return (
		<div className={styles.container}>
			{/* Background Elements */}
			<div className={styles.backgroundElements}>
				<div className={styles.gridPattern}></div>
			</div>
			{/* Header */}
			<header className='relative z-10 bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.1)] px-6 py-4'>
				<div className='flex items-center justify-between max-w-7xl mx-auto'>
					<div className='flex-1'></div>

					<div className='flex items-center gap-4'>
						<Image src={WLogo} alt='TrackIt Logo' width={32} height={32} />
						<span className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
							TrackIt
						</span>
					</div>

					<div className='flex-1 flex justify-end'>
						<button
							onClick={handleLogout}
							className='px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
						>
							<IoLogOutOutline size={16} />
							Log Out
						</button>
					</div>
				</div>
			</header>
			{/* Main Content */}
			<main className='relative z-10 flex-1 p-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
						{/* Profile Card */}
						<div className='lg:col-span-1'>
							<div className='bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] rounded-2xl p-8 relative shadow-2xl'>
								{/* Avatar */}
								<div className='absolute -top-8 left-1/2 transform -translate-x-1/2'>
									<div className='w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-[rgba(10,10,10,0.95)] shadow-lg'>
										{(user.username || user.email)?.charAt(0).toUpperCase()}
									</div>
								</div>

								{/* User Info */}
								<div className='text-center mt-8 mb-8'>
									<h1 className='text-2xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent mb-2'>
										{user.username || 'User'}
									</h1>
									<p className='text-[rgba(255,255,255,0.6)] text-sm'>
										{user.email}
									</p>
								</div>

								{/* Stats */}
								<div className='grid grid-cols-3 gap-4 mb-6'>
									<div className='text-center'>
										<div className='bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4 mb-2'>
											<IoFolderOutline
												className='text-blue-400 mx-auto'
												size={24}
											/>
										</div>
										<div className='text-2xl font-bold text-white'>
											{foreignProjects.length}
										</div>
										<div className='text-xs text-[rgba(255,255,255,0.5)]'>
											Foreign Projects
										</div>
									</div>
									<div className='text-center'>
										<div className='bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 mb-2'>
											<IoStatsChartOutline
												className='text-green-400 mx-auto'
												size={24}
											/>
										</div>
										<div className='text-2xl font-bold text-white'>
											{userProjects.length}
										</div>
										<div className='text-xs text-[rgba(255,255,255,0.5)]'>
											My Projects
										</div>
									</div>
									<div className='text-center'>
										<div className='bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4 mb-2'>
											<IoChatbubbleOutline
												className='text-purple-400 mx-auto'
												size={24}
											/>
										</div>
										<div className='text-2xl font-bold text-white'>
											{allComments}
										</div>
										<div className='text-xs text-[rgba(255,255,255,0.5)]'>
											Comments
										</div>
									</div>
								</div>

								{/* Registration Date */}
								<div className='flex items-center gap-2 text-[rgba(255,255,255,0.5)] text-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-3'>
									<IoCalendarOutline size={16} />
									<span>
										Registered:{' '}
										{new Date(user.createdAt).toLocaleDateString('en-GB', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
										})}
									</span>
								</div>
							</div>
						</div>

						{/* Projects Section */}
						<div className='lg:col-span-2'>
							<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 h-fit'>
								{/* My Projects */}
								<div className='bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] rounded-2xl p-6 shadow-2xl'>
									<div className='flex items-center gap-3 mb-6'>
										<div className='p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl'>
											<IoFolderOutline className='text-orange-400' size={20} />
										</div>
										<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
											My Projects
										</h3>
									</div>{' '}
									<div
										className={`space-y-2 max-h-80 overflow-y-auto ${styles.customScrollbar}`}
									>
										{userProjects.map(project => (
											<div
												key={project.id}
												onClick={() => setSelectedProjectName(project.name)}
												className={`
													p-3 rounded-xl cursor-pointer transition-all duration-200 border
													${
														selectedProjectName === project.name
															? 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30 text-white'
															: 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]'
													}
												`}
											>
												<div className='font-medium'>{project.name}</div>
											</div>
										))}
										{userProjects.length === 0 && (
											<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
												<IoFolderOutline className='mx-auto mb-2' size={24} />
												<p>No projects yet</p>
											</div>
										)}
									</div>
								</div>

								{/* Foreign Projects */}
								<div className='bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] rounded-2xl p-6 shadow-2xl'>
									<div className='flex items-center gap-3 mb-6'>
										<div className='p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl'>
											<IoPersonOutline className='text-blue-400' size={20} />
										</div>
										<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
											Foreign Projects
										</h3>
									</div>{' '}
									<div
										className={`space-y-2 max-h-80 overflow-y-auto ${styles.customScrollbar}`}
									>
										{foreignProjects.map(project => (
											<div
												key={project.id}
												onClick={() => setSelectedProjectName(project.name)}
												className={`
													p-3 rounded-xl cursor-pointer transition-all duration-200 border
													${
														selectedProjectName === project.name
															? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30 text-white'
															: 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]'
													}
												`}
											>
												<div className='font-medium'>{project.name}</div>
											</div>
										))}
										{foreignProjects.length === 0 && (
											<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
												<IoPersonOutline className='mx-auto mb-2' size={24} />
												<p>No foreign projects</p>
											</div>
										)}
									</div>
								</div>

								{/* Boards */}
								<div className='bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] rounded-2xl p-6 shadow-2xl'>
									<div className='flex items-center gap-3 mb-6'>
										<div className='p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl'>
											<IoGridOutline className='text-purple-400' size={20} />
										</div>
										<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
											{selectedProjectName
												? `Boards for ${selectedProjectName}`
												: 'Select Project'}
										</h3>
									</div>{' '}
									<div
										className={`space-y-2 max-h-80 overflow-y-auto ${styles.customScrollbar}`}
									>
										{selectedProjectBoards.map(board => (
											<div
												key={board.id}
												onClick={() => handleBoardClick(board)}
												className='p-3 rounded-xl cursor-pointer transition-all duration-200 border bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.7)] hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-purple-600/20 hover:border-purple-500/30 hover:text-white group'
											>
												<div className='flex items-center justify-between'>
													<span className='font-medium'>{board.name}</span>
													<IoArrowForwardOutline
														className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'
														size={16}
													/>
												</div>
											</div>
										))}
										{selectedProjectName &&
											selectedProjectBoards.length === 0 && (
												<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
													<IoGridOutline className='mx-auto mb-2' size={24} />
													<p>No boards in this project</p>
												</div>
											)}
										{!selectedProjectName && (
											<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
												<IoGridOutline className='mx-auto mb-2' size={24} />
												<p>Select a project to view boards</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>{' '}
		</div>
	);
}
