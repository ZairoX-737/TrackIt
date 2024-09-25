export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className='w-screen h-screen flex justify-center items-center'>
			{children}
		</section>
	);
}
