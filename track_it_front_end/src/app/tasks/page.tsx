'use client';
import styles from './Tasks.module.scss';
import TasksList from './tasklist';
import { useTaskStore } from '../store/taskStore';
import { nanoid } from 'nanoid';
import CreateTaskModal from '../components/CreateTaskModal';
import { BsPlus } from 'react-icons/bs';
import { useState, FormEvent } from 'react';

const TasksContainer = () => {
	const {
		tasks,
		columns,
		createTaskOpen,
		setCreateTaskOpen,
		selectedBoard,
		createColumn,
		createBoard,
		selectedProject,
	} = useTaskStore();
	const [newColumnName, setNewColumnName] = useState('');
	const [showColumnInput, setShowColumnInput] = useState(false);
	const [newBoardName, setNewBoardName] = useState('');
	const [showBoardInput, setShowBoardInput] = useState(false);

	const handleCreateColumn = async (e: FormEvent) => {
		e.preventDefault();
		if (newColumnName.trim() && selectedBoard) {
			await createColumn(selectedBoard.id, newColumnName.trim());
			setNewColumnName('');
			setShowColumnInput(false);
		}
	};

	const handleCreateBoard = async (e: FormEvent) => {
		e.preventDefault();
		if (newBoardName.trim() && selectedProject) {
			await createBoard(selectedProject.id, newBoardName.trim());
			setNewBoardName('');
			setShowBoardInput(false);
		}
	};

	// Если нет выбранной доски — предлагаем создать доску
	if (!selectedBoard) {
		return (
			<div className={styles.taskContainer}>
				<div className={styles.emptyStateContainer}>
					<div className={styles.emptyState}>
						<h2>No boards</h2>
						<p>Please create a board for this project first</p>
						{!showBoardInput ? (
							<button
								className={styles.createColumnBtn}
								onClick={() => setShowBoardInput(true)}
							>
								Create board
							</button>
						) : (
							<form
								onSubmit={handleCreateBoard}
								className={styles.columnCreateForm}
							>
								<input
									type='text'
									placeholder='Board name'
									value={newBoardName}
									onChange={e => setNewBoardName(e.target.value)}
									className={styles.columnNameInput}
									autoFocus
								/>
								<div className={styles.formButtons}>
									<button type='submit' className={styles.submitBtn}>
										Create
									</button>
									<button
										type='button'
										className={styles.cancelBtn}
										onClick={() => setShowBoardInput(false)}
									>
										Cancel
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Отображение пустого состояния, когда нет колонок
	if (columns.length === 0) {
		return (
			<div className={styles.taskContainer}>
				<div className={styles.emptyStateContainer}>
					<div className={styles.emptyState}>
						<h2>No columns</h2>
						<p>Create your first column to manage tasks</p>

						{!showColumnInput ? (
							<button
								className={styles.createColumnBtn}
								onClick={() => setShowColumnInput(true)}
							>
								Create column <BsPlus size='1.5em' />
							</button>
						) : (
							<form
								onSubmit={handleCreateColumn}
								className={styles.columnCreateForm}
							>
								<input
									type='text'
									value={newColumnName}
									onChange={e => setNewColumnName(e.target.value)}
									placeholder='Column name'
									autoFocus
									className={styles.columnNameInput}
								/>
								<div className={styles.formButtons}>
									<button
										type='submit'
										className={styles.submitBtn}
										disabled={!newColumnName.trim()}
									>
										Create
									</button>
									<button
										type='button'
										className={styles.cancelBtn}
										onClick={() => setShowColumnInput(false)}
									>
										Cancel
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		);
	}

	// Стандартное отображение, когда есть колонки
	return (
		<div className={styles.taskContainer}>
			{columns.map(column => {
				const listTasks = tasks.filter(task => task.columnId === column.id);
				return (
					<TasksList
						key={nanoid()}
						tasks={listTasks as any[]}
						TaskListHeader={column.name}
					/>
				);
			})}

			{/* Кнопка добавления новой колонки */}
			{!showColumnInput ? (
				<div className={styles.addColumnContainer}>
					<button
						className={styles.addColumnBtn}
						onClick={() => setShowColumnInput(true)}
					>
						<BsPlus size='2em' />
						Add column
					</button>
				</div>
			) : (
				<div className={styles.addColumnFormContainer}>
					<form
						onSubmit={handleCreateColumn}
						className={styles.columnCreateForm}
					>
						<input
							type='text'
							value={newColumnName}
							onChange={e => setNewColumnName(e.target.value)}
							placeholder='Column name'
							autoFocus
							className={styles.columnNameInput}
						/>
						<div className={styles.formButtons}>
							<button
								type='submit'
								className={styles.submitBtn}
								disabled={!newColumnName.trim()}
							>
								Create
							</button>
							<button
								type='button'
								className={styles.cancelBtn}
								onClick={() => setShowColumnInput(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}

			<CreateTaskModal
				isOpen={createTaskOpen}
				onClose={() => setCreateTaskOpen(false)}
				projectId={selectedProject?.id}
			/>
		</div>
	);
};

export default TasksContainer;
