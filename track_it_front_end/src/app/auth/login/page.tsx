'use client';
import Image from 'next/image';
import styles from '../auth.module.scss';
import WLogo from '../../../public/logo-white.png';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../api';
import Cookies from 'js-cookie';

const LoginPage = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Form data
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		username: 'user', // добавляем дефолтное значение для username
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
		// Clear error on input
		if (error) setError('');
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validation
		if (!formData.email.trim()) {
			setError('Please enter your email');
			return;
		}

		if (!formData.password) {
			setError('Please enter your password');
			return;
		}

		try {
			setLoading(true);
			const response = await AuthService.login({
				email: formData.email,
				password: formData.password,
				username: formData.username, // передаем username в AuthService
			});

			// Save token
			Cookies.set('accessToken', response.accessToken, { expires: 7 });

			// Redirect to tasks page
			router.replace('/tasks');
		} catch (error: any) {
			console.error('Login error:', error);
			setError(error.response?.data?.message || 'Invalid email or password');
		} finally {
			setLoading(false);
		}
	};

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
			<form className={styles.form} onSubmit={onSubmit}>
				<Image src={WLogo} alt='Logo' width={32} height={32} />

				{error && (
					<div className='text-red-500 text-sm text-center bg-red-100 bg-opacity-20 p-2 rounded'>
						{error}
					</div>
				)}

				<div>
					<label>Email</label>
					<input
						type='email'
						name='email'
						className={styles.textInput}
						value={formData.email}
						onChange={handleInputChange}
						disabled={loading}
						required
					/>
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
							name='password'
							value={formData.password}
							onChange={handleInputChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							disabled={loading}
							required
						/>
						<button
							type='button'
							onClick={showPswd}
							className='w-6 h-5'
							disabled={loading}
						>
							{showPassword ? (
								<div className=' bg-[#ff9800] w-full h-full rounded-md transition-all' />
							) : (
								<div className=' bg-[#00BCD4] w-full h-full rounded-md transition-all' />
							)}
						</button>
					</section>
				</div>

				<div className='flex justify-center items-center gap-1.5'>
					<button className={styles.submit} type='submit' disabled={loading}>
						{loading ? 'Logging in...' : 'Log In'}
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
