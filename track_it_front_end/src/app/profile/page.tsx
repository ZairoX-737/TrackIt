'use client';
import styles from './Profile.module.scss';
import { useTaskStore } from '../store/taskStore';
import { useInitializeApp } from '../hooks/useInitializeApp';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../api';
import Cookies from 'js-cookie';
import Image from 'next/image';
import WLogo from '../../public/logo-white.png';

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
			<div className={styles.profilePage}>
				<div className='text-white text-center pt-20'>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.profilePage}>
				<div className='text-red-500 text-center pt-20'>Error: {error}</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className={styles.profilePage}>
				<div className='text-red-500 text-center pt-20'>User not found</div>
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
								return taskAcc + (task.comments?.length || 0);
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
		<div className={styles.profilePage}>
			{/* Header */}
			<header className={styles.header}>
				<div className={styles.leftSection}>
					{/* Placeholder for left content if needed */}
				</div>

				<Image src={WLogo} alt='Logo' width={32} height={32} />

				<div className={styles.rightSection}>
					<button onClick={handleLogout} className={styles.logoutButton}>
						Log Out
					</button>
				</div>
			</header>

			<main className={styles.main}>
				<div className={styles.cardSection}>
					{/* Profile Card */}
					<div className={styles.profileCard}>
						<div className={styles.avatar}></div>
						<div className={styles.username}>{user.username || 'Username'}</div>

						<div className={styles.stats}>
							<div className={styles.statItem}>
								<span className={styles.statValue}>
									{foreignProjects.length}
								</span>
								<span className={styles.statLabel}>Foreign projects</span>
							</div>
							<div className={styles.statItem}>
								<span className={styles.statValue}>{userProjects.length}</span>
								<span className={styles.statLabel}>Self projects</span>
							</div>
							<div className={styles.statItem}>
								<span className={styles.statValue}>{allComments}</span>
								<span className={styles.statLabel}>Comments</span>
							</div>
						</div>

						<div className={styles.registered}>
							Registered since:{' '}
							{new Date(user.createdAt).toLocaleDateString('en-GB', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})}
						</div>
					</div>

					{/* Vertical Divider */}
					<div className={styles.verticalDivider}></div>

					{/* Projects and Boards Section */}
					<div className={styles.profileColumns}>
						{/* My Projects Column */}
						<div className={styles.profileColumn}>
							<h3 className={styles.profileColumnTitle}>My projects</h3>
							<ul
								className={`${styles.profileColumnList} ${styles.customScroll}`}
							>
								{userProjects.map(project => (
									<li
										key={project.id}
										className={
											selectedProjectName === project.name
												? styles.selected
												: ''
										}
										onClick={() => setSelectedProjectName(project.name)}
									>
										{project.name}
									</li>
								))}
								{userProjects.length === 0 && (
									<li style={{ opacity: 0.5, cursor: 'default' }}>
										No projects yet
									</li>
								)}
							</ul>
						</div>
						{/* Foreign Projects Column */}
						<div className={styles.profileColumn}>
							<h3 className={styles.profileColumnTitle}>Foreign projects</h3>
							<ul
								className={`${styles.profileColumnList} ${styles.customScroll}`}
							>
								{foreignProjects.map(project => (
									<li
										key={project.id}
										className={
											selectedProjectName === project.name
												? styles.selected
												: ''
										}
										onClick={() => setSelectedProjectName(project.name)}
									>
										{project.name}
									</li>
								))}
								{foreignProjects.length === 0 && (
									<li style={{ opacity: 0.5, cursor: 'default' }}>
										No foreign projects
									</li>
								)}
							</ul>
						</div>
						{/* Boards Column */}
						<div className={styles.profileColumn}>
							<h3 className={styles.profileColumnTitle}>
								{selectedProjectName
									? `Boards for ${selectedProjectName}`
									: 'Select project'}
							</h3>
							<ul
								className={`${styles.profileColumnList} ${styles.customScroll}`}
							>
								{selectedProjectBoards.map(board => (
									<li
										key={board.id}
										onClick={() => handleBoardClick(board)}
										style={{ cursor: 'pointer' }}
									>
										{board.name}
									</li>
								))}
								{selectedProjectName && selectedProjectBoards.length === 0 && (
									<li style={{ opacity: 0.5, cursor: 'default' }}>
										No boards in this project
									</li>
								)}
								{!selectedProjectName && (
									<li style={{ opacity: 0.5, cursor: 'default' }}>
										Select a project to view boards
									</li>
								)}
							</ul>
						</div>{' '}
					</div>
				</div>
			</main>
		</div>
	);
}
