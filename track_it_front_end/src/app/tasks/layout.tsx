'use client';
import Image from 'next/image';
import ArrowR from '../../public/right-arrow-white.png';
import ArrowD from '../../public/down-arrow-white.png';
import WLogo from '../../public/logo-white.png';
import Dots from '../../public/three-dots-hor.png';
import User from '../../public/user-profile-white.png';
import Notif from '../../public/notification-white.png';

import styles from './Tasks.module.scss';
import { useState } from 'react';

export default function TaskLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [BoardVisible, setBoardVisible] = useState(false);
	function handleBoardButton() {
		setBoardVisible(!BoardVisible);
	}
	return (
		<section lang='en'>
			<header className={styles.header}>
				<div className={styles.projectInfo}>
					<span className={styles.ProjectHeader}>Project Name</span>
					<hr className='h-8 w-[1px] bg-white' />

					<button
						className=' flex items-center hover:bg-[#51518a]'
						onClick={handleBoardButton}
					>
						<span>Board name</span>
						{BoardVisible ? (
							<Image
								src={ArrowD}
								alt='close board list'
								width={32}
								height={32}
							/>
						) : (
							<Image
								src={ArrowR}
								alt='open board list'
								width={32}
								height={32}
							/>
						)}
					</button>
				</div>

				<Image src={WLogo} alt='Logo' width={32} height={32} />

				<div className=' flex-1 flex self-center justify-end gap-3'>
					<button>
						<Image src={Notif} alt='Notifications' width={32} height={32} />
					</button>
					<hr className='h-8 w-[1px] bg-white' />
					<button>
						<Image src={User} alt='User profile' width={32} height={32} />
					</button>
					<hr className='h-8 w-[1px] bg-white' />
					<button>
						<Image src={Dots} alt='Project settings' width={32} height={32} />
					</button>
				</div>
			</header>
			{children}
		</section>
	);
}
