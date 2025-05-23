'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '../store/taskStore';
import Image from 'next/image';
import WLogo from '../../public/logo-white.png';
import styles from './welcome.module.scss';

export default function WelcomePage() {
	const router = useRouter();
	const { createProject, user, loadUserProfile } = useTaskStore();
	const [projectName, setProjectName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		// Загружаем профиль пользователя, если еще не загружен
		const loadUser = async () => {
			if (!user) {
				await loadUserProfile();
			}
		};

		loadUser();
	}, [user, loadUserProfile]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!projectName.trim()) {
			setError('Please enter a project name');
			return;
		}

		try {
			setLoading(true);
			setError('');

			// Создаем новый проект только с именем
			await createProject(projectName);

			// Перенаправляем на страницу задач
			router.replace('/tasks');
		} catch (err) {
			console.error('Error creating project:', err);
			setError('Failed to create project. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.welcomePage}>
			<div className={styles.welcomeContainer}>
				<div className={styles.welcomeHeader}>
					<Image src={WLogo} alt='TrackIt Logo' width={40} height={40} />
					<h1>Welcome to TrackIt!</h1>
				</div>

				<p className={styles.welcomeMessage}>
					Let's get started by creating your first project. Projects are where
					you'll organize your tasks and collaborate with team members.
				</p>

				{error && <div className={styles.errorMessage}>{error}</div>}

				<form className={styles.projectForm} onSubmit={handleSubmit}>
					<div className={styles.formGroup}>
						<label htmlFor='projectName'>Project Name*</label>
						<input
							id='projectName'
							type='text'
							placeholder='My Awesome Project'
							value={projectName}
							onChange={e => setProjectName(e.target.value)}
							disabled={loading}
							required
						/>
					</div>

					<div className={styles.buttonGroup}>
						<button
							type='submit'
							className={styles.createButton}
							disabled={loading}
						>
							{loading ? 'Creating Project...' : 'Create Project & Continue'}
						</button>
						<button
							type='button'
							className={styles.skipButton}
							onClick={() => router.replace('/tasks')}
							disabled={loading}
						>
							Skip for now
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
