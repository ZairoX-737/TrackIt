'use client';
import Image from 'next/image';
import styles from './mainpage.module.scss';
import WLogo from '../public/logo-white.png';
import Link from 'next/link';
import LandingScreen from '../public/landing_screen.png';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MainPage() {
	const { isAuthenticated, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Если пользователь аутентифицирован, перенаправляем на страницу задач
		if (!loading && isAuthenticated) {
			router.replace('/tasks');
		}
	}, [isAuthenticated, loading, router]);

	// Показываем загрузку пока проверяем аутентификацию
	if (loading) {
		return (
			<div className='w-screen h-screen flex items-center justify-center'>
				<div className='text-white text-xl'>Loading...</div>
			</div>
		);
	}

	return (
		<>
			<header>
				<nav className={styles.nav}>
					<div className='flex gap-2 text-xl cursor-pointer'>
						<Image src={WLogo} alt='Logo' width={32} height={32} />
						<span className='self-end'>TrackIt</span>
					</div>
					<div className='flex gap-3 items-center'>
						<Link href='/auth/login'>
							<button className={`${styles.btn} ${styles.logIn}`}>
								Log in
							</button>
						</Link>
						<Link href='/auth/register'>
							<button className={`${styles.btn} ${styles.signIn}`}>
								Sign Up
							</button>
						</Link>
					</div>
				</nav>
			</header>
			<section className='w-screen h-[93vh] flex items-center'>
				<div className='flex flex-col gap-3 w-fit ml-[10%] mt-12 self-start'>
					<h1 className={styles.header1}>
						Organize. Track.
						<br />
						<span>Achieve.</span>
					</h1>
					<h2 className={styles.header2}>
						TrackIt helps you organize tasks, track progress, and achieve
						<br /> your goals effortlessly, whether solo or with a team.
					</h2>
					<Link href='/auth/register'>
						<button
							className={`${styles.btn} ${styles.signIn} ${styles.btnLong}`}
						>
							Sign Up for free
						</button>
					</Link>
				</div>
				<div className='self-start mt-10 ml-[15%] mr-7 w-[500px] h-[500px]'>
					<Image
						src={LandingScreen}
						alt='landing screen'
						width={1000}
						height={1000}
					/>
				</div>
			</section>
		</>
	);
}
