'use client';
import Image from 'next/image';
import styles from '../auth.module.scss';
import WLogo from '../../../public/logo-white.png';
import Link from 'next/link';
import { useState } from 'react';

const RegisterPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	function handleRegister() {
		console.log('hello');
	}

	return (
		<div className='flex flex-col items-center gap-2'>
			<form className={styles.form} id='register'>
				<Image src={WLogo} alt='Logo' width={32} height={32} />
				<div>
					<label>Username</label>
					<input></input>
				</div>

				<div>
					<label>Email</label>
					<input type='email'></input>
				</div>

				<div>
					<label>Password</label>
					<section className={styles.showPassword}>
						<input type={showPassword ? 'text' : 'password'}></input>
						<button type='button' className='w-6 h-6'>
							{showPassword ? (
								<div className=' bg-[#ff9800] w-full h-full' />
							) : (
								<div className=' bg-[#00BCD4] w-full h-full' />
							)}
						</button>
					</section>
				</div>

				<div>
					<label>Repeat password</label>
					<input type={showPassword ? 'text' : 'password'}></input>
				</div>

				<div className='flex justify-center items-center gap-1.5'>
					<button className={styles.submit} onClick={handleRegister}>
						Sign Up
					</button>
					<Link href={'login'}>
						<span className=' opacity-50 font-light'>
							Already have account?
						</span>
					</Link>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
