'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

import ArrowR from '../../public/right-arrow-white.png';
import ArrowD from '../../public/down-arrow-white.png';
import WLogo from '../../public/logo-white.png';
import Dots from '../../public/three-dots-hor.png';
import User from '../../public/user-profile-white.png';
import Notif from '../../public/notification-white.png';

import styles from './Tasks.module.scss';
import NotificationsModal from '../components/NotifModal';
import SettingsModal from '../components/SettingsModal';

export default function TaskLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	// State for managing visibility and selection
	const [projectVisible, setProjectVisible] = useState(false);
	const [boardVisible, setBoardVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState('Marketing'); //  Initial project
	const [selectedBoard, setSelectedBoard] = useState('Sprint 1'); // Initial board
	const [selectedProjectInModal, setSelectedProjectInModal] =
		useState<string>(selectedProject);

	const projectRef = useRef<HTMLDivElement>(null);
	const boardRef = useRef<HTMLDivElement>(null);
	const notificationsRef = useRef<HTMLDivElement>(null);
	const settingsRef = useRef<HTMLDivElement>(null);

	// List of projects and their related boards
	const projectsAndBoards: Record<string, string[]> = {
		Marketing: ['Sprint 1', 'Sprint 2'],
		Development: ['Bug Fixes', 'Feature Development'],
		Design: ['UI Improvements', 'UX Research'],
		Sales: ['Client Outreach', 'Lead Generation'],
		test1: ['Client Outreach', 'Lead Generation'],
		test2: ['Client Outreach', 'Lead Generation'],
		test3: ['Client Outreach', 'Lead Generation'],
		test4: ['Client Outreach', 'Lead Generation'],
		test5: ['Client Outreach', 'Lead Generation'],
		test6: ['Client Outreach', 'Lead Generation'],
		test7: ['Client Outreach', 'Lead Generation'],
		test8: ['Client Outreach', 'Lead Generation'],
		test9: ['Client Outreach', 'Lead Generation'],
		test10: ['Client Outreach', 'Lead Generation'],
		test11: ['Client Outreach', 'Lead Generation'],
		test12: ['Client Outreach', 'Lead Generation'],
		test13: ['Client Outreach', 'Lead Generation'],
	};

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				projectRef.current &&
				!projectRef.current.contains(event.target as Node)
			) {
				setProjectVisible(false);
			}
			if (
				boardRef.current &&
				!boardRef.current.contains(event.target as Node)
			) {
				setBoardVisible(false);
			}
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setNotificationsOpen(false);
			}
			if (
				settingsRef.current &&
				!settingsRef.current.contains(event.target as Node)
			) {
				setSettingsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Functions for selecting project and board
	const selectProject = (project: string) => {
		setSelectedProject(project);
		setSelectedBoard(projectsAndBoards[project][0]); // First board by default
		setProjectVisible(false);
	};

	const selectBoard = (board: string) => {
		setSelectedBoard(board);
		setBoardVisible(false);
	};

	// Open modal window
	const openModal = () => {
		setProjectVisible(false);
		setBoardVisible(false);
		setSelectedProjectInModal(selectedProject);
		setModalVisible(true);
	};

	// Select item from modal window
	const selectItemInModal = (project: string, board: string) => {
		setSelectedProject(project);
		setSelectedBoard(board);
		setModalVisible(false);
	};

	// Toggle notification and settings modals
	const toggleNotifications = () => {
		setSettingsOpen(false);
		setNotificationsOpen(!notificationsOpen);
	};

	const toggleSettings = () => {
		setNotificationsOpen(false);
		setSettingsOpen(!settingsOpen);
	};

	return (
		<section lang='en'>
			<header className={styles.header}>
				<div className={styles.projectInfo}>
					{/* Project dropdown */}
					<div className='relative' ref={projectRef}>
						<button
							className={styles.projectInfoButtons}
							onClick={() => setProjectVisible(prev => !prev)}
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
							onClick={() => setBoardVisible(prev => !prev)}
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

				<div className='flex-1 flex justify-end items-center gap-3'>
					{/* Notifications button and modal */}
					<div className='relative' ref={notificationsRef}>
						<button onClick={toggleNotifications}>
							<Image src={Notif} alt='Notifications' width={32} height={32} />
						</button>
						<NotificationsModal
							isOpen={notificationsOpen}
							onClose={() => setNotificationsOpen(false)}
						/>
					</div>
					<hr className='h-8 w-[1px] bg-white' />
					<button>
						<Image src={User} alt='User profile' width={32} height={32} />
					</button>
					<hr className='h-8 w-[1px] bg-white' />
					{/* Settings button and modal */}
					<div className='relative' ref={settingsRef}>
						<button onClick={toggleSettings}>
							<Image src={Dots} alt='Project settings' width={32} height={32} />
						</button>
						<SettingsModal
							isOpen={settingsOpen}
							onClose={() => setSettingsOpen(false)}
						/>
					</div>
				</div>
			</header>
			{children}

			{/* Project/board selection modal */}
			{modalVisible && (
				<div
					className={styles.modalOverlay}
					onClick={() => setModalVisible(false)}
				>
					<div
						className={styles.modalContent}
						onClick={e => e.stopPropagation()}
					>
						<div className={styles.modalColumns}>
							{/* Left column: projects */}
							<div className={styles.projectColumn}>
								<h3 className='select-none'>Projects</h3>
								<ul>
									{Object.keys(projectsAndBoards).map(project => (
										<li
											key={project}
											className={
												selectedProjectInModal === project
													? styles.selected
													: ''
											}
											onClick={() => setSelectedProjectInModal(project)}
										>
											{project}
										</li>
									))}
								</ul>
							</div>
							{/* Right column: boards */}
							<div className={styles.boardColumn}>
								<h3 className='select-none'>
									Boards for {selectedProjectInModal}
								</h3>
								<ul>
									{projectsAndBoards[selectedProjectInModal].map(board => (
										<li
											key={board}
											onClick={() =>
												selectItemInModal(selectedProjectInModal, board)
											}
										>
											{board}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
