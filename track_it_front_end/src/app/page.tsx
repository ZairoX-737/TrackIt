'use client';
import Image from 'next/image';
import styles from './mainpage.module.scss';
import WLogo from '../public/logo-white.png';
import Link from 'next/link';
import { useAuth } from './hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Если пользователь аутентифицирован, перенаправляем на страницу задач
		if (!loading && isAuthenticated) {
			router.replace('/tasks');
		}
	}, [isAuthenticated, loading, router]);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Показываем загрузку пока проверяем аутентификацию
	if (loading) {
		return (
			<div className={styles.loadingScreen}>
				<div className={styles.loadingSpinner}></div>
				<div className={styles.loadingText}>Loading...</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{/* Background Elements */}
			<div className={styles.backgroundElements}>
				<div className={styles.gradientOrb1}></div>
				<div className={styles.gradientOrb2}></div>
				<div className={styles.gridPattern}></div>
			</div>

			{/* Header */}
			<header className={styles.header}>
				<nav className={styles.nav}>
					<div className={styles.logo}>
						<Image src={WLogo} alt='Logo' width={40} height={40} />
						<span className={styles.logoText}>TrackIt</span>
					</div>
					<div className={styles.navButtons}>
						{' '}
						<Link href='/auth/login'>
							<button className={`${styles.btn} ${styles.btnSecondary}`}>
								Log in
							</button>
						</Link>
						<Link href='/auth/register'>
							<button className={`${styles.btn} ${styles.btnPrimary}`}>
								Sign up
							</button>
						</Link>
					</div>
				</nav>
			</header>

			{/* Main Content */}
			<main className={styles.main}>
				<div className={styles.hero}>
					{' '}
					<div
						className={`${styles.heroContent} ${
							isVisible ? styles.fadeInUp : ''
						}`}
					>
						<div className={styles.badge}>
							<span>✨ New way to manage tasks</span>
						</div>
						<h1 className={styles.heroTitle}>
							Organize. Track.
							<br />
							<span className={styles.gradient}>Achieve.</span>
						</h1>
						<p className={styles.heroDescription}>
							TrackIt helps you organize tasks, track progress, and achieve your
							goals effortlessly, whether working solo or with a team.
						</p>
						<div className={styles.heroButtons}>
							<Link href='/auth/register'>
								<button
									className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}
								>
									Get started for free
									<span className={styles.btnIcon}>→</span>
								</button>
							</Link>
						</div>
					</div>
					<div
						className={`${styles.heroCards} ${
							isVisible ? styles.fadeInRight : ''
						}`}
					>
						<div className={styles.cardsContainer}>
							<div className={styles.staticCard}>
								<div className={styles.cardHeader}>
									<div className={styles.cardIcon}>📋</div>
									<div className={styles.cardTitle}>Today's Tasks</div>
								</div>
								<div className={styles.cardStats}>
									<div className={styles.statItem}>
										<span className={styles.statNumber}>12</span>
										<span className={styles.statLabel}>Completed</span>
									</div>
									<div className={styles.statItem}>
										<span className={styles.statNumber}>3</span>
										<span className={styles.statLabel}>Remaining</span>
									</div>
								</div>
								<div className={styles.progressBar}>
									<div
										className={styles.progressFill}
										style={{ width: '80%' }}
									></div>
								</div>
							</div>
							<div className={styles.staticCard}>
								<div className={styles.cardHeader}>
									<div className={styles.cardIcon}>🎯</div>
									<div className={styles.cardTitle}>Project Progress</div>
								</div>
								<div className={styles.cardContent}>
									<div className={styles.projectItem}>
										<span className={styles.projectName}>Website Redesign</span>
										<span className={styles.projectPercent}>85%</span>
									</div>
									<div className={styles.projectItem}>
										<span className={styles.projectName}>Mobile App</span>
										<span className={styles.projectPercent}>62%</span>
									</div>
									<div className={styles.projectItem}>
										<span className={styles.projectName}>
											Marketing Campaign
										</span>
										<span className={styles.projectPercent}>94%</span>
									</div>
								</div>
							</div>{' '}
							<div className={`${styles.staticCard} ${styles.wideCard}`}>
								<div className={styles.cardHeader}>
									<div className={styles.cardIcon}>👥</div>
									<div className={styles.cardTitle}>Team Activity</div>
								</div>
								<div className={styles.cardContent}>
									<div className={styles.activityFeed}>
										<div className={styles.activityItem}>
											<div className={styles.activityDot}></div>
											<div className={styles.activityContent}>
												<span className={styles.activityText}>
													John completed "Design Review"
												</span>
												<span className={styles.activityTime}>2 min ago</span>
											</div>
										</div>
										<div className={styles.activityItem}>
											<div className={styles.activityDot}></div>
											<div className={styles.activityContent}>
												<span className={styles.activityText}>
													Sarah added new task "Update Documentation"
												</span>
												<span className={styles.activityTime}>5 min ago</span>
											</div>
										</div>
										<div className={styles.activityItem}>
											<div className={styles.activityDot}></div>
											<div className={styles.activityContent}>
												<span className={styles.activityText}>
													Mike updated project status
												</span>
												<span className={styles.activityTime}>12 min ago</span>
											</div>
										</div>
										<div className={styles.activityItem}>
											<div className={styles.activityDot}></div>
											<div className={styles.activityContent}>
												<span className={styles.activityText}>
													Emma joined the project
												</span>
												<span className={styles.activityTime}>1 hour ago</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>{' '}
				</div>
			</main>
		</div>
	);
}
