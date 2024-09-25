import { redirect } from 'next/navigation';

export default function Auth() {
	const isRegistered = false;
	return (
		<>{isRegistered ? redirect('/auth/login') : redirect('/auth/register')}</>
	);
}
