'use client';
import styles from './Profile.module.scss';
import { useTaskStore } from '../store/taskStore';
import { useInitializeApp } from '../hooks/useInitializeApp';

export default function UserProfile() {
	const { loading, error } = useInitializeApp();
	const { user, projects, selectedProject, boards, tasks } = useTaskStore();

	if (loading) {
		return (
			<div className={styles.profilePage}>
				<div className={styles.loading}>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.profilePage}>
				<div className={styles.error}>Error: {error}</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className={styles.profilePage}>
				<div className={styles.error}>User not found</div>
			</div>
		);
	}

	// Подсчитываем статистику
	const userProjects = projects.filter(p => p.createdBy === user.id);
	const foreignProjects = projects.filter(p => p.createdBy !== user.id);
	const userTasks = tasks.filter(t => t.createdBy === user.id);
	const completedTasks = userTasks.filter(
		t => t.status === 'done' || t.status === 'completed'
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
						<div className={styles.username}>{user.username || user.email}</div>
					</div>

					<div className={styles.statsCard}>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>
								{new Date(user.createdAt).toLocaleDateString('en')}
							</span>
							<span className={styles.statLabel}>Registered</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>
								{foreignProjects.length}
							</span>
							<span className={styles.statLabel}>Collaborative projects</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>{userProjects.length}</span>
							<span className={styles.statLabel}>Own projects</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>{userTasks.length}</span>
							<span className={styles.statLabel}>Total tasks</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>{completedTasks.length}</span>
							<span className={styles.statLabel}>Completed tasks</span>
						</div>
					</div>
				</section>

				<section className={styles.projectsSection}>
					<h2 className={styles.sectionTitle}>My projects</h2>
					<div className={styles.projectGrid}>
						{userProjects.length > 0 ? (
							userProjects.map(project => (
								<div key={project.id} className={styles.projectCard}>
									<h3 className={styles.projectName}>{project.name}</h3>
									<p className={styles.projectDescription}>
										{project.description || 'No description'}
									</p>
									<div className={styles.projectStats}>
										<span>Boards: {project.boards?.length || 0}</span>
									</div>
								</div>
							))
						) : (
							<div className={styles.emptyState}>
								<p>You have no own projects yet</p>
							</div>
						)}
					</div>
				</section>

				{foreignProjects.length > 0 && (
					<section className={styles.projectsSection}>
						<h2 className={styles.sectionTitle}>Collaborative projects</h2>
						<div className={styles.projectGrid}>
							{foreignProjects.map(project => (
								<div key={project.id} className={styles.projectCard}>
									<h3 className={styles.projectName}>{project.name}</h3>
									<p className={styles.projectDescription}>
										{project.description || 'No description'}
									</p>
									<div className={styles.projectStats}>
										<span>Boards: {project.boards?.length || 0}</span>
									</div>
								</div>
							))}
						</div>
					</section>
				)}
			</main>
		</div>
	);
}
