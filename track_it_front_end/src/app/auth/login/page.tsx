'use client';
import Image from 'next/image';
import styles from '../auth.module.scss';
import WLogo from '../../../public/logo-white.png';
import Link from 'next/link';
import { useState } from 'react';

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	function handleLogin() {
		console.log('hello');
	}

	function showPswd() {
		setShowPassword(!showPassword);
	}

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	return (
		<div className='flex flex-col items-center gap-2'>
			<form className={styles.form} id='register'>
				<Image src={WLogo} alt='Logo' width={32} height={32} />
				<div>
					<label>Username</label>
					<input type='text' className={styles.textInput}></input>
				</div>

				<div>
					<label>Email</label>
					<input type='email' className={styles.textInput}></input>
				</div>

				<div>
					<label>Password</label>
					<section
						className={styles.showPassword}
						style={
							isFocused
								? { borderColor: '#ff9800' }
								: { borderColor: '#00000099' }
						}
					>
						<input
							className={styles.passwordInput}
							type={showPassword ? 'text' : 'password'}
							onFocus={handleFocus}
							onBlur={handleBlur}
						></input>
						<button type='button' onClick={showPswd} className='w-6 h-5'>
							{showPassword ? (
								<div className=' bg-[#ff9800] w-full h-full rounded-md transition-all' />
							) : (
								<div className=' bg-[#00BCD4] w-full h-full rounded-md transition-all' />
							)}
						</button>
					</section>
				</div>

				<div className='flex justify-center items-center gap-1.5'>
					<button className={styles.submit} onClick={handleLogin}>
						Log In
					</button>
					<Link href={'register'}>
						<span className=' opacity-50 font-light'>
							Don't have an account?
						</span>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default LoginPage;
