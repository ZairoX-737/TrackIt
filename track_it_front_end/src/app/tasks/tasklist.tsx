'use client';
import { BsPlus } from 'react-icons/bs';
import styles from './Tasks.module.scss';
import Task from './task';
import { nanoid } from 'nanoid';
import { useTaskStore } from '../store/taskStore';
import { Task as TaskType } from '../api/types';

interface IProps {
	tasks: TaskType[];
	TaskListHeader: string;
}

const TasksList = ({ tasks, TaskListHeader }: IProps) => {
	const { createTaskOpen, setCreateTaskOpen } = useTaskStore();

	const handleChangeState = () => {
		setCreateTaskOpen(!createTaskOpen);
	};

	if (tasks.length !== 0) {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{TaskListHeader}</h1>
				<hr className='bg-[#969697] w-[97%] self-start' />
				<ol className={styles.taskList}>
					{tasks.map((task: any) => (
						<Task key={nanoid()} task={task} />
					))}
				</ol>
				<button
					className={`${styles.addTask} font-rubik`}
					onClick={handleChangeState}
				>
					Add Task
					<BsPlus size='1.5em' />
				</button>
			</div>
		);
	} else {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{TaskListHeader}</h1>
				<hr className='bg-white w-full' />
				<span className='opacity-55 select-none'>Empty column...</span>
				<button
					className={`${styles.addTask} font-rubik`}
					onClick={handleChangeState}
				>
					Add Task
					<BsPlus size='1.5em' />
				</button>
			</div>
		);
	}
};

export default TasksList;
