'use client';
import { useState } from 'react';
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
	const [showDescr, setShowDescr] = useState(false);
	function handleClick() {
		console.log(task);
	}
	function handleTaskDescription() {}
	return (
		<div
			className={styles.task}
			onMouseEnter={() => setShowDescr(true)}
			onMouseLeave={() => setShowDescr(false)}
		>
			<div className='flex justify-start items-center mb-[7px] gap-2'>
				<div className=' rounded-[10px] w-[30px] h-[10px] bg-red-500' />
				<div className=' rounded-[10px] w-[30px] h-[10px] bg-red-500' />
				<div className=' rounded-[10px] w-[30px] h-[10px] bg-red-500' />
			</div>
			<div className='flex justify-between items-center'>
				<div className=' font-medium text-[16px]'>{task.header}</div>
				<div className={styles.taskSettings} onClick={handleClick}>
					<BsThreeDotsVertical size='1.3em' className={styles.taskSettings} />
				</div>
			</div>
			<div className={`${styles.taskDescription} font-rubik`}>
				{showDescr ? <span className=''>{task.description}</span> : ''}
			</div>
		</div>
	);
};
export default Task;
