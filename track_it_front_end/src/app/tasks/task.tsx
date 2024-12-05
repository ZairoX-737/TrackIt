'use client';
import { useState } from 'react';
import styles from './Tasks.module.scss';
import { BsThreeDots } from 'react-icons/bs';
import { nanoid } from 'nanoid';

interface IProps {
	task: {
		id: number;
		status: string;
		header: string;
		description: string;
		labels: string[];
	};
}

const Task = ({ task }: IProps) => {
	const [showDescr, setShowDescr] = useState(false);
	function handleClick() {
		console.log(task.id);
	}
	return (
		<li key={task.id} className={styles.task}>
			<div className='flex justify-between items-center'>
				<div className='flex justify-start items-center mb-[7px] gap-2'>
					{task.labels.map((label: any) => {
						return (
							<div
								key={nanoid()}
								className={styles.label}
								style={{
									backgroundColor: label,
								}}
							></div>
						);
					})}
				</div>
				<div>
					<div className={styles.taskSettings} onClick={handleClick}>
						<BsThreeDots size='1.4em' className={styles.taskSettings} />
					</div>
				</div>
			</div>
			<div className=' font-medium text-[16px] select-none'>{task.header}</div>
			<div className={`${styles.taskDescription} font-rubik`}>
				{showDescr ? <span className=''>{task.description}</span> : ''}
			</div>
		</li>
	);
};
export default Task;
