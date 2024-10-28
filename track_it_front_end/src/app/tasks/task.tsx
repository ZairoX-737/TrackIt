'use client';
import styles from './Tasks.module.scss';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface IProps {
	task: {
		id: number;
		status: string;
		header: string;
		description: string;
	};
	textColor: any;
}

const Task = ({ task }: IProps) => {
	function handleClick() {
		console.log(task);
	}
	let headerStyle;
	switch (task.status) {
		case 'backlog':
			headerStyle = '#f87171';
			break;
		case 'doing':
			headerStyle = '#f8cf2a';
			break;
		case 'review':
			headerStyle = '#4ade80';
			break;
		case 'done':
			headerStyle = '#60a5fa';
			break;
	}

	return (
		<div className={styles.task}>
			<div className='flex justify-between items-center mb-1'>
				<div className=' font-semibold' style={{ color: headerStyle }}>
					{task.header}
				</div>
				<div className={styles.taskSettings} onClick={handleClick}>
					<BsThreeDotsVertical size='1.3em' className={styles.taskSettings} />
				</div>
			</div>
			<div className={`${styles.taskDescription} font-rubik`}>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus corrupti
				fugiat dolores cumque voluptates rem earum adipisci veritatis officia
				dolor, asperiores reprehenderit inventore minima nesciunt, id
				temporibus! Vel, itaque adipisci?
			</div>
		</div>
	);
};
export default Task;
