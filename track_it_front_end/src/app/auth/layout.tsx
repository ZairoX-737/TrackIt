import styles from './auth.module.scss';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={styles.authContainer}>{children}</div>;
}
