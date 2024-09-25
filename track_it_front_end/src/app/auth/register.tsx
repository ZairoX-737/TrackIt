import styles from './auth.module.scss';

const RegisterPage = () => {
	return (
		<>
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
			</form>
		</>
	);
};

export default RegisterPage;
