'use client';
import { useRef } from 'react';
import styles from './Tasks.module.scss';
import { useTaskStore } from '../store/taskStore';

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
	const { setTaskDetailOpen, setSelectedTaskForDetail } = useTaskStore();
	const taskRef = useRef<HTMLLIElement>(null);

	function handleTaskClick() {
		setSelectedTaskForDetail(task as any);
		setTaskDetailOpen(true);
	}

	return (
		<li
			ref={taskRef}
			key={task.id}
			className={styles.task}
			onClick={handleTaskClick}
		>
			{/* Labels section */}
			{(task.labels ?? []).length > 0 && (
				<div className={styles.taskLabels}>
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
								className={styles.taskLabel}
								style={{
									backgroundColor: labelColor,
								}}
							></div>
						);
					})}
				</div>
			)}

			{/* Task title */}
			<div className={styles.taskTitle}>{task.title}</div>

			{/* Task description */}
			{task.description && (
				<div className={styles.taskDescription}>{task.description}</div>
			)}
		</li>
	);
};
export default Task;
