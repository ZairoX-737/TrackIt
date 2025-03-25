'use client';
import styles from './Tasks.module.scss';
import TasksList from './tasklist';
import { useTaskStore } from '../store/taskStore';
import { nanoid } from 'nanoid';
import CreateTaskModal from '../components/CreateTaskModal';

const TasksContainer = () => {
	const { tasks, columns, createTaskOpen, setCreateTaskOpen } = useTaskStore();

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
			<CreateTaskModal
				isOpen={createTaskOpen}
				onClose={() => setCreateTaskOpen(false)}
			/>
		</div>
	);
};

export default TasksContainer;
