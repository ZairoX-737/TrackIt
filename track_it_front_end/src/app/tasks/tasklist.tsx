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
		labels: string[];
	}[];
	TaskListHeader: string;
}

const TasksList = (props: IProps) => {
	if (props.tasks.length != 0) {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{props.TaskListHeader}</h1>
				<hr className=' bg-[#969697] w-[97%] self-start' />
				<ol className={styles.taskList}>
					{props.tasks.map((task: any) => {
						return <Task key={nanoid()} task={task} />;
					})}
				</ol>
			</div>
		);
	} else {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{props.TaskListHeader}</h1>
				<hr className=' bg-white w-full ' />
				<button className={`${styles.addTask} font-rubik`}>
					Add Task
					<BsPlus size='1.5em' />
				</button>
				<span className='opacity-55 select-none'>Empty column...</span>
			</div>
		);
	}
};

export default TasksList;
