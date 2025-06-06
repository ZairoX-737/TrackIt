import type { Metadata, Viewport } from 'next';
import './globals.scss';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Loading from './loading';

const inter = Inter({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700', '800'],
	variable: '--font-inter',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'TrackIt - Organize Your Tasks',
	description:
		'Modern task and project management system. Organize, track, and achieve your goals effortlessly.',
	keywords: 'task management, projects, team, planning, tracker',
	authors: [{ name: 'TrackIt Team' }],
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#ff9800',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<Suspense fallback={<Loading />}>
				<body className={`${inter.className} antialiased`}>{children}</body>
			</Suspense>
		</html>
	);
}
