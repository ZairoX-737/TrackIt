'use client';
import styles from '../auth.module.scss';

const RegisterPage = () => {
	function handleRegister() {
		console.log('hello');
	}

	return (
		<div className='flex flex-col items-center gap-2'>
			<h1 className={styles.formHeader}>Register to TaskIt</h1>
			<form className={styles.form} id='register'>
				<div>
					<span>Username</span>
					<input></input>
				</div>
				<div>
					<span>Email</span>
					<input type='email'></input>
				</div>

				<div>
					<span>Password</span>
					<input type='password'></input>
				</div>

				<button className={styles.submit} onClick={handleRegister}>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
