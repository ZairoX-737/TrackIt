import styles from './Tasks.module.scss';
import Task from './task';
import { BsPlus } from 'react-icons/bs';
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

const TasksContainer = () => {
	return (
		<div className={styles.taskContainer}>
			{Object.values(LIST_TYPES).map(type => {
				const listTasks: {
					id: number;
					status: string;
					header: string;
					description: string;
				}[] = tasks.filter(task => task.status === type);
				return (
					<TasksList
						key={nanoid()}
						tasks={listTasks}
						TaskListHeader={LIST_TYPES_COPY[type]}
					/>
				);
			})}
		</div>
	);
};
export default TasksContainer;
