import styles from '../auth.module.scss';

const LoginPage = () => {
	return (
		<>
			<form className={styles.form} id='login'>
				<input></input>
				<input type='email'></input>
				<input type='password'></input>
			</form>
		</>
	);
};

export default LoginPage;
