'use client';
import Image from 'next/image';
import styles from '../auth.module.scss';
import WLogo from '../../../public/logo-white.png';
import Link from 'next/link';
import { useState } from 'react';

const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isFocused2, setIsFocused2] = useState(false);

	function handleRegister() {
		console.log('hello');
	}

	function showPswd() {
		setShowPassword(!showPassword);
	}
	function showPswd2() {
		setShowPassword2(!showPassword2);
	}

	const handleFocus = (e: any) => {
		if (e.target.id == 'pswd1') {
			setIsFocused(true);
		} else {
			setIsFocused2(true);
		}
	};

	const handleBlur = (e: any) => {
		if (e.target.id == 'pswd1') {
			setIsFocused(false);
		} else {
			setIsFocused2(false);
		}
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
							id='pswd1'
							onFocus={e => handleFocus(e)}
							onBlur={e => handleBlur(e)}
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

				<div>
					<label>Repeat password</label>
					<section
						className={styles.showPassword}
						style={
							isFocused2
								? { borderColor: '#ff9800' }
								: { borderColor: '#00000099' }
						}
					>
						<input
							type={showPassword2 ? 'text' : 'password'}
							className={styles.passwordInput}
							onFocus={e => handleFocus(e)}
							onBlur={e => handleBlur(e)}
						></input>
						<button type='button' onClick={showPswd2} className='w-6 h-5'>
							{showPassword2 ? (
								<div className=' bg-[#ff9800] w-full h-full rounded-md ' />
							) : (
								<div className=' bg-[#00BCD4] w-full h-full rounded-md' />
							)}
						</button>
					</section>
				</div>

				<div className='flex justify-center items-center gap-1.5'>
					<button className={styles.submit} onClick={handleRegister}>
						Sign Up
					</button>
					<Link href={'login'}>
						<span className=' opacity-50 font-light'>
							Already have an account?
						</span>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
