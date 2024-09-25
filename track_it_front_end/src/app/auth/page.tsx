import RegisterPage from './register';
import LoginPage from './login';

const isRegistered = false;

export default function Auth() {
	return isRegistered ? <LoginPage /> : <RegisterPage />;
}
