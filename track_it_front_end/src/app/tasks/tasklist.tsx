import { BsPlus } from 'react-icons/bs';
import styles from './Tasks.module.scss';
import Task from './task';
import { nanoid } from 'nanoid';

interface IProps {
	tasks: {
		id: number;
		status: string;
		header: string;
		description: string;
	}[];
	TaskListHeader: string;
}

const TasksList = (props: IProps) => {
	if (props.tasks.length != 0) {
		return (
			<div className={styles.tasklist}>
				<h1 className={`${styles.tasklistHeader}`}>{props.TaskListHeader}</h1>
				<hr className=' bg-white w-full ' />
				{props.tasks.map((task: any) => {
					return <Task key={nanoid()} textColor={styles} task={task} />;
				})}
				{/* <button className={`${styles.addTask} font-rubik`}>
				<BsPlus size='1.5em' />
				Add Card
			</button> */}
			</div>
		);
	} else {
		return (
			<div className={styles.tasklist}>
				<h1 className={`${styles.tasklistHeader}`}>{props.TaskListHeader}</h1>
				<hr className=' bg-white w-full ' />
				<button className={`${styles.addTask} font-rubik`}>
					<BsPlus size='1.5em' />
					Add Card
				</button>
			</div>
		);
	}
};

export default TasksList;
