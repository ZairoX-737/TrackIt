'use client';
import Image from 'next/image';
import { useRef, useEffect, memo } from 'react';
import { useTaskStore } from '../store/taskStore'; // Adjust path as needed

import ArrowR from '../../public/right-arrow-white.png';
import ArrowD from '../../public/down-arrow-white.png';
import WLogo from '../../public/logo-white.png';
import Dots from '../../public/three-dots-hor.png';
import User from '../../public/user-profile-white.png';
import Notif from '../../public/notification-white.png';

import styles from './Tasks.module.scss';
import NotificationsModal from '../components/NotifModal';
import SettingsModal from '../components/SettingsModal';
import ProjectBoardModal from '../components/ProjectBoardModal';
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
		notifOpen,
		settingsOpen,
		selectedProject,
		selectedBoard,
		projectsAndBoards,
		setProjectVisible,
		setBoardVisible,
		setModalVisible,
		setNotifOpen,
		setSettingsOpen,
		selectProject,
		selectBoard,
		handleModalSelection,
		toggleNotifications,
		toggleSettings,
	} = useTaskStore();

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
				notifOpen &&
				notificationsRef.current &&
				!notificationsRef.current.contains(target)
			) {
				setNotifOpen(false);
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
	}, [projectVisible, boardVisible, notifOpen, settingsOpen]);

	const openModal = () => {
		setProjectVisible(false);
		setBoardVisible(false);
		setModalVisible(true);
	};

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
							<span>{selectedProject}</span>
							<Image
								src={projectVisible ? ArrowD : ArrowR}
								alt='toggle project list'
								width={24}
								height={24}
							/>
						</button>
						{projectVisible && (
							<div className={styles.headerList}>
								<ul className='flex flex-col'>
									{Object.keys(projectsAndBoards)
										.slice(0, 5)
										.map(project => (
											<li
												key={project}
												className={styles.headerListItem}
												onClick={() => selectProject(project)}
											>
												{project}
											</li>
										))}
									<li
										className={`${styles.headerListItem}`}
										onClick={openModal}
									>
										<Image
											src={Dots}
											alt='More projects'
											width={32}
											height={32}
										/>
									</li>
								</ul>
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
							<span>{selectedBoard}</span>
							<Image
								src={boardVisible ? ArrowD : ArrowR}
								alt='toggle board list'
								width={24}
								height={24}
							/>
						</button>
						{boardVisible && (
							<div className={styles.headerList}>
								<ul>
									{projectsAndBoards[selectedProject].slice(0, 5).map(board => (
										<li
											key={board}
											className={styles.headerListItem}
											onClick={() => selectBoard(board)}
										>
											{board}
										</li>
									))}
									<li
										className={`${styles.headerListItem}`}
										onClick={openModal}
									>
										<Image
											src={Dots}
											alt='More boards'
											width={32}
											height={32}
										/>
									</li>
								</ul>
							</div>
						)}
					</div>
				</div>

				<Image src={WLogo} alt='Logo' width={32} height={32} />

				<div className='flex-1 flex justify-end gap-3 items-center'>
					{/* Notifications button and modal */}
					<div className='relative top-1' ref={notificationsRef}>
						<button onClick={toggleNotifications} className='self-center'>
							<Image
								src={Notif}
								alt='Notifications'
								width={32}
								height={32}
								className='select-none'
							/>
						</button>
						<NotificationsModal
							isOpen={notifOpen}
							onClose={() => setNotifOpen(false)}
						/>
					</div>
					<hr className='h-8 w-[1px] bg-white' />
					<Link href='/profile'>
						<button>
							<Image
								src={User}
								alt='User profile'
								width={32}
								height={32}
								className='select-none'
							/>
						</button>
					</Link>
					<hr className='h-8 w-[1px] bg-white' />
					{/* Settings button and modal */}
					<div className='relative top-1' ref={settingsRef}>
						<button onClick={toggleSettings}>
							<Image
								src={Dots}
								alt='Project settings'
								width={32}
								height={32}
								className='select-none'
							/>
						</button>
						<SettingsModal
							isOpen={settingsOpen}
							onClose={() => setSettingsOpen(false)}
							selectedProject={selectedProject}
							projectsAndBoards={projectsAndBoards}
						/>
					</div>
				</div>
			</header>

			<MemoizedChildren>{children}</MemoizedChildren>

			{/* Project/board selection modal */}
			<ProjectBoardModal
				isOpen={modalVisible}
				onClose={() => setModalVisible(false)}
				projectsAndBoards={projectsAndBoards}
				selectedProject={selectedProject}
				onSelect={handleModalSelection}
			/>
		</section>
	);
}
