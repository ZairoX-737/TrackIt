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
	columnId?: string; // Добавляем ID колонки
}

const TasksList = ({ tasks, TaskListHeader, columnId }: IProps) => {
	const { createTaskOpen, setCreateTaskOpen, setPreselectedColumnId } =
		useTaskStore();

	const handleChangeState = () => {
		// Устанавливаем предварительно выбранную колонку
		if (columnId) {
			setPreselectedColumnId(columnId);
		}
		setCreateTaskOpen(!createTaskOpen);
	};
	if (tasks.length !== 0) {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{TaskListHeader}</h1>
				<ol className={styles.taskList}>
					{tasks.map((task: any) => (
						<Task key={nanoid()} task={task} />
					))}
				</ol>
				<button className={styles.addTask} onClick={handleChangeState}>
					Add Task
					<BsPlus size='1.2em' />
				</button>
			</div>
		);
	} else {
		return (
			<div className={styles.taskColumn}>
				<h1 className={styles.tasklistHeader}>{TaskListHeader}</h1>
				<div className={styles.emptyColumn}>
					<span className={styles.emptyText}>No tasks yet</span>
					<p className={styles.emptyDescription}>
						Create your first task to get started
					</p>
				</div>
				<button className={styles.addTask} onClick={handleChangeState}>
					Add Task
					<BsPlus size='1.2em' />
				</button>
			</div>
		);
	}
};

export default TasksList;
