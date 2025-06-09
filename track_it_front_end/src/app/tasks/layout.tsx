'use client';
import Image from 'next/image';
import { useRef, useEffect, memo, useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Project, Board } from '../api/types';

import ArrowR from '../../public/right-arrow-white.png';
import ArrowD from '../../public/down-arrow-white.png';
import WLogo from '../../public/logo-white.png';
import Dots from '../../public/three-dots-hor.png';
import User from '../../public/user-profile-white.png';

import styles from './Tasks.module.scss';
import headerButtonStyles from '../components/HeaderButton.module.scss';
import NotificationBell from '../components/NotificationBell';
import SettingsModal from '../components/SettingsModal';
import ProjectBoardModal from '../components/ProjectBoardModal';
import CreateModal from '../components/CreateModal';
import TaskDetailModal from '../components/TaskDetailModal';
import ProjectSettingsModal from '../components/ProjectSettingsModal';
import ProjectUsersModal from '../components/ProjectUsersModal';
import DeleteProjectModal from '../components/DeleteModal';
import Link from 'next/link';

const MemoizedChildren = memo(({ children }: { children: React.ReactNode }) => (
	<>{children}</>
));

export default function TaskLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const {
		projectVisible,
		boardVisible,
		modalVisible,
		settingsOpen,
		taskDetailOpen,
		selectedTaskForDetail,
		selectedProject,
		selectedBoard,
		projects,
		boards,
		setProjectVisible,
		setBoardVisible,
		setModalVisible,
		setSettingsOpen,
		setTaskDetailOpen,
		setSelectedTaskForDetail,
		selectProject,
		selectBoard,
		handleModalSelection,
		toggleSettings,
		loadProjects,
		loadUserProfile,
		createProject,
		createBoard,
		updateTask,
		deleteTask,
	} = useTaskStore();
	useEffect(() => {
		loadUserProfile();
		loadProjects();
	}, [loadUserProfile, loadProjects]);

	const projectRef = useRef<HTMLDivElement>(null);
	const boardRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);

	// Close dropdowns/modals when clicking outside, optimized to reduce re-renders
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as Node;
			if (
				projectVisible &&
				projectRef.current &&
				!projectRef.current.contains(target)
			) {
				setProjectVisible(false);
			}
			if (
				boardVisible &&
				boardRef.current &&
				!boardRef.current.contains(target)
			) {
				setBoardVisible(false);
			}
			if (
				settingsOpen &&
				settingsRef.current &&
				!settingsRef.current.contains(target)
			) {
				setSettingsOpen(false);
			}
			// Note: modalVisible (ProjectBoardModal) is handled by its own onClose
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [projectVisible, boardVisible, settingsOpen]);
	const openModal = () => {
		setProjectVisible(false);
		setBoardVisible(false);
		setModalVisible(true);
	};
	// State for create modal
	const [createModalOpen, setCreateModalOpen] = useState(false);
	const [createModalType, setCreateModalType] = useState<'project' | 'board'>(
		'project'
	);

	// State for project settings modals (moved from SettingsModal to fix positioning)
	const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
	const [projectUsersOpen, setProjectUsersOpen] = useState(false);
	const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

	return (
		<section lang='en'>
			<header className={styles.header}>
				<div className={styles.projectInfo}>
					{/* Project dropdown */}
					<div className='relative' ref={projectRef}>
						<button
							className={styles.projectInfoButtons}
							onClick={() => setProjectVisible(!projectVisible)}
						>
							<span>
								{selectedProject ? selectedProject.name : 'Select project'}
							</span>
							<Image
								src={projectVisible ? ArrowD : ArrowR}
								alt='toggle project list'
								width={24}
								height={24}
							/>
						</button>{' '}
						{projectVisible && (
							<div className={styles.headerList}>
								<ul className='flex flex-col'>
									{projects.slice(0, 5).map(project => (
										<li
											key={project.id}
											className={styles.headerListItem}
											onClick={() => {
												selectProject(project);
											}}
										>
											{project.name}
										</li>
									))}{' '}
									<li
										className={`${styles.headerListItem}`}
										onClick={openModal}
									>
										<Image
											src={Dots}
											alt='More projects'
											width={16}
											height={16}
										/>
									</li>
								</ul>
								<div
									style={{
										borderTop: '1px solid #444',
										marginTop: '8px',
										paddingTop: '8px',
									}}
								>
									{' '}
									<button
										className={styles.createButton}
										onClick={() => {
											setCreateModalType('project');
											setCreateModalOpen(true);
											setProjectVisible(false);
										}}
									>
										+ Create Project
									</button>
								</div>
							</div>
						)}
					</div>

					<hr className='h-8 w-[1px] bg-white mx-2' />

					{/* Board dropdown */}
					<div className='relative' ref={boardRef}>
						<button
							className={styles.projectInfoButtons}
							onClick={() => setBoardVisible(!boardVisible)}
						>
							<span>{selectedBoard ? selectedBoard.name : 'Select board'}</span>
							<Image
								src={boardVisible ? ArrowD : ArrowR}
								alt='toggle board list'
								width={24}
								height={24}
							/>
						</button>{' '}
						{boardVisible && selectedProject && (
							<div className={styles.headerList}>
								{' '}
								<ul>
									{selectedProject.boards?.slice(0, 5).map(board => (
										<li
											key={board.id}
											className={styles.headerListItem}
											onClick={() => {
												selectBoard(board);
											}}
										>
											{board.name}
										</li>
									))}{' '}
									<li
										className={`${styles.headerListItem}`}
										onClick={openModal}
									>
										<Image
											src={Dots}
											alt='More boards'
											width={16}
											height={16}
										/>
									</li>
								</ul>
								<div
									style={{
										borderTop: '1px solid #444',
										marginTop: '8px',
										paddingTop: '8px',
									}}
								>
									{' '}
									<button
										className={styles.createButton}
										onClick={() => {
											setCreateModalType('board');
											setCreateModalOpen(true);
											setBoardVisible(false);
										}}
									>
										+ Create Board
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
				<Image src={WLogo} alt='Logo' width={32} height={32} />{' '}
				<div className='flex-1 flex justify-end gap-3 items-center'>
					{/* Notifications bell */}
					<NotificationBell
						projectId={selectedProject?.id}
						className='self-center'
					/>{' '}
					<hr className='h-8 w-[1px] bg-white' />
					<Link href='/profile'>
						<div className={headerButtonStyles.headerButton}>
							<Image
								src={User}
								alt='User profile'
								width={24}
								height={24}
								className='select-none'
							/>
						</div>
					</Link>
					<hr className='h-8 w-[1px] bg-white' />
					{/* Settings button and modal */}
					<div className='relative' ref={settingsRef}>
						<button
							onClick={toggleSettings}
							className={headerButtonStyles.headerButton}
						>
							<Image
								src={Dots}
								alt='Project settings'
								width={24}
								height={24}
								className='select-none'
							/>
						</button>{' '}
						<SettingsModal
							isOpen={settingsOpen}
							onClose={() => setSettingsOpen(false)}
							selectedProject={selectedProject}
							onOpenProjectSettings={() => setProjectSettingsOpen(true)}
							onOpenProjectUsers={() => setProjectUsersOpen(true)}
							onOpenDeleteProject={() => setDeleteProjectOpen(true)}
						/>
					</div>
				</div>
			</header>
			<MemoizedChildren>{children}</MemoizedChildren>{' '}
			{/* Project/board selection modal */}{' '}
			<ProjectBoardModal
				isOpen={modalVisible}
				onClose={() => setModalVisible(false)}
				projects={projects}
				selectedProject={selectedProject}
				onSelect={(project: Project, board: Board) => {
					if (project && board) handleModalSelection(project, board);
				}}
				onCreateProject={() => {
					setCreateModalType('project');
					setCreateModalOpen(true);
				}}
				onCreateBoard={() => {
					setCreateModalType('board');
					setCreateModalOpen(true);
				}}
			/>{' '}
			{/* Create project/board modal */}{' '}
			<CreateModal
				isOpen={createModalOpen}
				onClose={() => setCreateModalOpen(false)}
				type={createModalType}
				selectedProjectId={selectedProject?.id}
				onSuccess={() => {
					// Store methods already update state, no need to reload
				}}
			/>
			{/* Task detail modal */}
			<TaskDetailModal
				isOpen={taskDetailOpen}
				onClose={() => {
					setTaskDetailOpen(false);
					setSelectedTaskForDetail(null);
				}}
				task={selectedTaskForDetail}
				projectId={selectedProject?.id}
				onTaskUpdate={updatedTask => {
					updateTask(updatedTask.id, updatedTask);
					setSelectedTaskForDetail(updatedTask);
				}}
				onTaskDelete={taskId => {
					deleteTask(taskId);
					setTaskDetailOpen(false);
					setSelectedTaskForDetail(null);
				}}
			/>
			{/* Project settings modals (moved here to fix positioning issues) */}
			{projectSettingsOpen && selectedProject && (
				<ProjectSettingsModal
					project={selectedProject}
					isOpen={projectSettingsOpen}
					onClose={() => setProjectSettingsOpen(false)}
				/>
			)}
			{projectUsersOpen && selectedProject && (
				<ProjectUsersModal
					projectId={selectedProject.id}
					projectName={selectedProject.name}
					isOpen={projectUsersOpen}
					onClose={() => setProjectUsersOpen(false)}
				/>
			)}
			{deleteProjectOpen && selectedProject && (
				<DeleteProjectModal
					isOpen={deleteProjectOpen}
					onClose={() => setDeleteProjectOpen(false)}
					project={selectedProject}
					onProjectDeleted={() => {
						setDeleteProjectOpen(false);
						setSettingsOpen(false); // Also close settings dropdown
					}}
				/>
			)}
		</section>
	);
}
