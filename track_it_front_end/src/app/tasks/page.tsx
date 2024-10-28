import styles from './Tasks.module.scss';
import TasksList from './tasklist';
import { LIST_TYPES, LIST_TYPES_COPY } from '../../config/config.js';
import { nanoid } from 'nanoid';

const tasks = [
	{
		id: 1,
		status: 'backlog',
		header: 'Task1',
		description: 'Lorem ipsum dolor',
	},
	{
		id: 2,
		status: 'backlog',
		header: 'Task2',
		description: 'Lorem ipsum dolor',
	},
	{
		id: 3,
		status: 'doing',
		header: 'Task3',
		description: 'Lorem ipsum dolor',
	},
	{
		id: 4,
		status: 'review',
		header: 'Task4',
		description: 'Lorem ipsum dolor',
	},
];

const columns = [
	{
		id: 1,
		name: 'backlog',
	},
	{
		id: 2,
		name: 'doing',
	},
	{
		id: 3,
		name: 'review',
	},
	{
		id: 4,
		name: 'done',
	},
];

const TasksContainer = () => {
	return (
		<div className={styles.taskContainer}>
			{columns.map(column => {
				const listTasks: {
					id: number;
					status: string;
					header: string;
					description: string;
				}[] = tasks.filter(task => task.status === column.name);
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
