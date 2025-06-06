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
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Form data
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		username: 'user',
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
			setError('Please enter your email address');
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
				username: formData.username,
			});

			// Save token
			Cookies.set('accessToken', response.accessToken, { expires: 7 });

			// Redirect to tasks page
			router.replace('/tasks');
		} catch (error: any) {
			console.error('Login error:', error);
			setError(
				error.response?.data?.message ||
					'Invalid email or password. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	const togglePassword = () => {
		setShowPassword(!showPassword);
	};
	return (
		<div className={styles.authPage}>
			<div className={styles.authContainer}>
				<div className={styles.authCard}>
					<div className={styles.authHeader}>
						<Image src={WLogo} alt='TrackIt Logo' width={40} height={40} />
						<h1 className={styles.authTitle}>Welcome Back</h1>
						<p className={styles.authSubtitle}>
							Sign in to your account to continue
						</p>
					</div>

					<form className={styles.authForm} onSubmit={onSubmit}>
						{error && <div className={styles.errorMessage}>{error}</div>}

						<div className={styles.inputGroup}>
							<label className={styles.inputLabel} htmlFor='email'>
								Email Address
							</label>
							<input
								id='email'
								type='email'
								name='email'
								className={styles.input}
								value={formData.email}
								onChange={handleInputChange}
								disabled={loading}
								placeholder='Enter your email'
								required
							/>
						</div>

						<div className={styles.inputGroup}>
							<label className={styles.inputLabel} htmlFor='password'>
								Password
							</label>
							<div className={styles.passwordContainer}>
								<input
									id='password'
									type={showPassword ? 'text' : 'password'}
									name='password'
									className={styles.input}
									value={formData.password}
									onChange={handleInputChange}
									disabled={loading}
									placeholder='Enter your password'
									required
								/>
								<button
									type='button'
									onClick={togglePassword}
									className={styles.passwordToggle}
									disabled={loading}
									aria-label={showPassword ? 'Hide password' : 'Show password'}
								>
									{showPassword ? (
										<svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
											<path
												d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'
												fill='currentColor'
											/>
										</svg>
									) : (
										<svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
											<path
												d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
												fill='currentColor'
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						<button
							type='submit'
							className={`${styles.submitButton} ${
								loading ? styles.loading : ''
							}`}
							disabled={loading}
						>
							{loading ? (
								<>
									<div className={styles.spinner}></div>
									Signing In...
								</>
							) : (
								'Sign In'
							)}
						</button>

						<div className={styles.authFooter}>
							<p className={styles.authLink}>
								Don't have an account?{' '}
								<Link href='/auth/register' className={styles.link}>
									Sign up
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
