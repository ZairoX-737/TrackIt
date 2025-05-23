'use client';
import { useState } from 'react';
import styles from './Tasks.module.scss';
import { BsThreeDots } from 'react-icons/bs';
import { nanoid } from 'nanoid';

interface IProps {
	task: {
		id: string;
		title: string;
		description?: string;
		status: string;
		labels?: any[];
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
				{' '}
				<div className='flex justify-start items-center mb-[7px] gap-1'>
					{(task.labels ?? []).map((labelData: any, index: number) => {
						// Определяем цвет лейбла из разных возможных структур данных
						let labelColor = '';

						if (typeof labelData === 'string') {
							// Если это просто строка с цветом
							labelColor = labelData;
						} else if (labelData.label && labelData.label.color) {
							// Структура из бэкенда: {label: {color: '#FF6565'}}
							labelColor = labelData.label.color;
						} else if (labelData.color) {
							// Прямая структура: {color: '#FF6565'}
							labelColor = labelData.color;
						}

						return (
							<div
								key={`${task.id}-label-${index}`}
								className={styles.label}
								style={{
									backgroundColor: labelColor,
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
			<div className=' font-medium text-[16px] select-none'>{task.title}</div>
			<div className={`${styles.taskDescription} font-rubik`}>
				{showDescr ? <span className=''>{task.description}</span> : ''}
			</div>
		</li>
	);
};
export default Task;
