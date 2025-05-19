'use client';
import styles from './Profile.module.scss';
import { useTaskStore } from '../store/taskStore';
import { useMemo } from 'react';

export default function UserProfile() {
	const user = {
		username: 'Username',
		registered: '10.10.2024',
		foreignProjects: 0,
		selfProjects: 5,
		comments: 12,
	};

	const projectsAndBoards = useTaskStore(s => s.projectsAndBoards);
	const selectedProject = useTaskStore(s => s.selectedProject);
	const selectProject = useTaskStore(s => s.selectProject);

	const boards = useMemo(
		() => projectsAndBoards[selectedProject] || [],
		[projectsAndBoards, selectedProject]
	);

	return (
		<div className={styles.profilePage}>
			<main className={styles.main}>
				<section className={styles.cardSection}>
					<div className={styles.profileCard}>
						<div className={styles.avatar}>
							<img
								src='/user-profile-white.png'
								alt='avatar'
								style={{ width: '100%', height: '100%', borderRadius: '50%' }}
							/>
						</div>
						<div className={styles.username}>{user.username}</div>
						<div className={styles.stats}>
							<div>
								<span className={styles.statValue}>{user.foreignProjects}</span>
								<span className={styles.statLabel}>Foreign projects</span>
							</div>
							<div>
								<span className={styles.statValue}>{user.selfProjects}</span>
								<span className={styles.statLabel}>Self projects</span>
							</div>
							<div>
								<span className={styles.statValue}>{user.comments}</span>
								<span className={styles.statLabel}>Comments</span>
							</div>
						</div>
						<div className={styles.registered}>
							Registered since: <span>{user.registered}</span>
						</div>
					</div>
					<div className={styles.verticalDivider}></div>
					<div
						style={{
							flex: 1,
							display: 'flex',
							alignItems: 'center',
							minWidth: 0,
						}}
					>
						<div
							style={{
								display: 'flex',
								gap: '40px',
								width: '100%',
								maxHeight: 350,
								minWidth: 600,
								overflow: 'hidden',
							}}
						>
							<div className={styles.profileColumns}>
								{/* Левая колонка: проекты */}
								<div className={styles.profileColumn + ' ' + styles.customScroll}>
									<div className={styles.profileColumnTitle}>Projects</div>
									<ul className={styles.profileColumnList}>
										{Object.keys(projectsAndBoards).map(project => (
											<li
												key={project}
												className={
													selectedProject === project ? styles.selected : ''
												}
												onClick={() => selectProject(project)}
											>
												{project}
											</li>
										))}
									</ul>
								</div>
								{/* Правая колонка: доски */}
								<div className={styles.profileColumn + ' ' + styles.customScroll}>
									<div className={styles.profileColumnTitle}>Boards</div>
									<ul className={styles.profileColumnList}>
										{boards.length === 0 && (
											<li style={{ color: '#bdbdbd', cursor: 'default' }}>
												No boards
											</li>
										)}
										{boards.map(board => (
											<li
												key={board}
												onClick={() =>
													alert(`Go to ${selectedProject} / ${board}`)
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
				</section>
			</main>
		</div>
	);
}
