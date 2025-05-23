'use client';
import Image from 'next/image';
import styles from '../auth.module.scss';
import WLogo from '../../../public/logo-white.png';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../api';
import Cookies from 'js-cookie';

const RegisterPage = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isFocused2, setIsFocused2] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Form data
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
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
		if (!formData.username.trim()) {
			setError('Please enter your username');
			return;
		}

		if (!formData.email.trim()) {
			setError('Please enter your email');
			return;
		}

		if (!formData.password) {
			setError('Please enter your password');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		if (formData.password.length < 6) {
			setError('Password must be at least 6 characters long');
			return;
		}

		try {
			setLoading(true);
			const response = await AuthService.register({
				username: formData.username, // изменили name на username
				email: formData.email,
				password: formData.password,
			});

			// Save token
			Cookies.set('accessToken', response.accessToken, { expires: 7 });

			// Вместо прямого перенаправления на страницу задач,
			// перенаправляем на страницу создания первого проекта
			router.replace('/welcome');
		} catch (error: any) {
			console.error('Registration error:', error);
			setError(
				error.response?.data?.message ||
					'Registration failed. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	function showPswd() {
		setShowPassword(!showPassword);
	}
	function showPswd2() {
		setShowPassword2(!showPassword2);
	}

	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.target.name === 'password') {
			setIsFocused(true);
		} else if (e.target.name === 'confirmPassword') {
			setIsFocused2(true);
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.target.name === 'password') {
			setIsFocused(false);
		} else if (e.target.name === 'confirmPassword') {
			setIsFocused2(false);
		}
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
					<label>Username</label>
					<input
						type='text'
						name='username'
						className={styles.textInput}
						value={formData.username}
						onChange={handleInputChange}
						disabled={loading}
						required
					/>
				</div>

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

				<div>
					<label>Confirm Password</label>
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
							name='confirmPassword'
							className={styles.passwordInput}
							value={formData.confirmPassword}
							onChange={handleInputChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							disabled={loading}
							required
						/>
						<button
							type='button'
							onClick={showPswd2}
							className='w-6 h-5'
							disabled={loading}
						>
							{showPassword2 ? (
								<div className=' bg-[#ff9800] w-full h-full rounded-md ' />
							) : (
								<div className=' bg-[#00BCD4] w-full h-full rounded-md' />
							)}
						</button>
					</section>
				</div>

				<div className='flex justify-center items-center gap-1.5'>
					<button className={styles.submit} type='submit' disabled={loading}>
						{loading ? 'Signing up...' : 'Sign Up'}
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
