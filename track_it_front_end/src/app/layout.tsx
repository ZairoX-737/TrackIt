import type { Metadata } from 'next';
import './globals.scss';
import { Rubik } from 'next/font/google';

const rubik = Rubik({
	subsets: ['latin'],
	weight: 'variable',
	variable: '--font-rubik',
});

export const metadata: Metadata = {
	title: 'TaskIt',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${rubik.variable} antialiased`}>{children}</body>
		</html>
	);
}
