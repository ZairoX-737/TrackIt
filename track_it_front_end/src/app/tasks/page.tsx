import styles from './Tasks.module.scss';
import TasksList from './tasklist';
import { nanoid } from 'nanoid';

const tasks = [
	{
		id: 1,
		status: 'backlog',
		header: 'Task1',
		description: 'Lorem ipsum dolor',
		labels: ['#ef4444', '#4ade80', '#60a5fa'],
	},
	{
		id: 2,
		status: 'backlog',
		header: 'Task1',
		description: 'Lorem ipsum dolor',
		labels: ['#4ade80', '#60a5fa'],
	},
	{
		id: 3,
		status: 'backlog',
		header: 'Task1',
		description: 'Lorem ipsum dolor',
		labels: ['#ef4444', '#60a5fa'],
	},
	{
		id: 4,
		status: 'backlog',
		header:
			'Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolor',
		description: 'Lorem ipsum dolor',
		labels: ['#60a5fa'],
	},
	{
		id: 5,
		status: 'backlog',
		header:
			'Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolor',
		description: 'Lorem ipsum dolor',
		labels: ['#ef4444'],
	},
	{
		id: 6,
		status: 'backlog',
		header: 'Task2',
		description: 'Lorem ipsum dolor',
		labels: ['#ef4444', '#60a5fa'],
	},
	{
		id: 7,
		status: 'doing',
		header: 'Task3',
		description: 'Lorem ipsum dolor',
		labels: ['#4ade80', '#ef4444', '#60a5fa'],
	},
	{
		id: 8,
		status: 'review',
		header: 'Task4',
		description: 'Lorem ipsum dolor',
		labels: ['#4ade80', '#60a5fa'],
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
	{
		id: 5,
		name: 'rework',
	},
	{
		id: 6,
		name: 'Steve Jobs',
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
					labels: string[];
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
