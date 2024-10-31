import Image from 'next/image';
import ArrowR from '../../public/right-arrow-white.png';
import ArrowD from '../../public/down-arrow-white.png';
import WLogo from '../../public/logo-white.png';
import Dots from '../../public/three-dots-hor.png';
import User from '../../public/user-profile-white.png';
import Notif from '../../public/notification-white.png';

import styles from './Tasks.module.scss';

export default function TaskLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section lang='en'>
			<header className={styles.header}>
				<div className={styles.projectInfo}>
					<span className=' text-[30px] font-light'>Project Name</span>
					<hr className='h-8 w-[1px] bg-white' />
					<button className=' flex items-center'>
						<span>Board name</span>
						<Image src={ArrowR} alt='open boards' width={32} height={32} />
					</button>
				</div>

				<Image src={WLogo} alt='Logo' width={32} height={32} />

				<div className=' flex-1 flex self-center justify-end gap-3'>
					<button>
						<Image src={Notif} alt='open boards' width={32} height={32} />
					</button>
					<hr className='h-8 w-[1px] bg-white' />
					<button>
						<Image src={User} alt='open boards' width={32} height={32} />
					</button>
					<hr className='h-8 w-[1px] bg-white' />
					<button>
						<Image src={Dots} alt='open boards' width={32} height={32} />
					</button>
				</div>
			</header>
			{children}
		</section>
	);
}
