// tasks-page.tsx
'use client';
import styles from './Tasks.module.scss';
import TasksList from './tasklist';
import { useTaskStore } from '../store/taskStore'; // Adjust path as needed
import { nanoid } from 'nanoid';

const TasksContainer = () => {
	const { tasks, columns } = useTaskStore();

	return (
		<div className={styles.taskContainer}>
			{columns.map(column => {
				const listTasks = tasks.filter(task => task.status === column.name);
				return (
					<TasksList
						key={nanoid()}
						tasks={listTasks}
						TaskListHeader={column.name}
					/>
				);
			})}
		</div>
	);
};

export default TasksContainer;
