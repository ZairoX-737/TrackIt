'use client';
import Image from 'next/image';
import styles from './mainpage.module.scss';
import WLogo from '../public/logo-white.png';

export default function MainPage() {
	return (
		<>
			<header>
				<nav className={styles.nav}>
					<div>
						<Image src={WLogo} alt='Logo' width={32} height={32} />
					</div>
					<div className='flex gap-3 items-center'>
						<button className={`${styles.btn} ${styles.logIn}`}>Log in</button>
						<button className={`${styles.btn} ${styles.signIn}`}>
							Sign Up
						</button>
					</div>
				</nav>
			</header>
			<section className='w-screen h-[93vh]'>
				<div className='flex flex-col justify-around items-start'>
					<h1 className={styles.header1}>
						Organize. Track.
						<br />
						<span>Achieve.</span>
					</h1>
					<h2 className={styles.header2}>
						TrackIt helps you organize tasks, track progress, and achieve
						<br /> your goals effortlessly, whether solo or with a team.
					</h2>
					<button
						className={`${styles.btn} ${styles.signIn} ${styles.btnLong}`}
					>
						Sign Up for free
					</button>
				</div>
			</section>
		</>
	);
}
