'use client';
import Image from 'next/image';
import styles from './mainpage.module.scss';
import WLogo from '../public/logo-white.png';
import Link from 'next/link';

export default function MainPage() {
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
			<section className='w-screen h-[93vh] flex justify-between items-center'>
				<div className='flex flex-col items-flex-start gap-3 w-fit  m-auto mt-12'>
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

				<div className='opacity-0 cursor-default w-[650px] h-[400px]'></div>
			</section>
		</>
	);
}
