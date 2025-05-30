import { useState, useEffect } from 'react';
import { IoClose, IoTrash } from 'react-icons/io5';
import { FiSave } from 'react-icons/fi';
import { useTaskStore } from '../store/taskStore';
import { Project, Board, Column } from '../api/types';
import LabelsModal from './LabelsModal';

interface ProjectSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	project: Project | null;
}

interface BoardChange {
	id: string;
	originalName: string;
	newName: string;
	isDeleted: boolean;
}

interface ColumnChange {
	id: string;
	originalName: string;
	newName: string;
	isDeleted: boolean;
	boardId: string;
}

export default function ProjectSettingsModal({
	isOpen,
	onClose,
	project,
}: ProjectSettingsModalProps) {
	const {
		updateProject,
		updateBoard,
		deleteBoard,
		updateColumn,
		deleteColumn,
		loadProjects,
		loading,
	} = useTaskStore();

	// Локальные состояния для накопления изменений
	const [editedProjectName, setEditedProjectName] = useState('');
	const [boardChanges, setBoardChanges] = useState<Record<string, BoardChange>>(
		{}
	);
	const [columnChanges, setColumnChanges] = useState<
		Record<string, ColumnChange>
	>({});
	const [editingProjectName, setEditingProjectName] = useState(false);
	const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
	const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
	const [showLabelsModal, setShowLabelsModal] = useState(false);

	// Инициализация состояний при открытии модалки или изменении проекта
	useEffect(() => {
		if (project && isOpen) {
			setEditedProjectName(project.name);
			// Сбрасываем изменения досок и колонок
			setBoardChanges({});
			setColumnChanges({});
			setEditingProjectName(false);
			setEditingBoardId(null);
			setEditingColumnId(null);
		}
	}, [project, isOpen]);

	if (!isOpen || !project) return null;

	const boards = project.boards || [];

	// Функция для получения текущего имени доски (с учетом локальных изменений)
	const getBoardDisplayName = (board: Board): string => {
		const change = boardChanges[board.id];
		return change ? change.newName : board.name;
	};

	// Функция для проверки, удалена ли доска локально
	const isBoardDeleted = (board: Board): boolean => {
		const change = boardChanges[board.id];
		return change ? change.isDeleted : false;
	};

	// Функции для колонок
	const getColumnDisplayName = (column: Column): string => {
		const change = columnChanges[column.id];
		return change ? change.newName : column.name;
	};

	const isColumnDeleted = (column: Column): boolean => {
		const change = columnChanges[column.id];
		return change ? change.isDeleted : false;
	};

	// Проверка наличия изменений
	const hasChanges = (): boolean => {
		const hasProjectNameChange = editedProjectName !== project.name;
		const hasBoardChanges = Object.keys(boardChanges).length > 0;
		const hasColumnChanges = Object.keys(columnChanges).length > 0;
		return hasProjectNameChange || hasBoardChanges || hasColumnChanges;
	};

	// Обработчики для названия проекта
	const handleProjectNameClick = () => {
		setEditingProjectName(true);
	};

	const handleProjectNameKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			setEditingProjectName(false);
		} else if (e.key === 'Escape') {
			setEditedProjectName(project.name);
			setEditingProjectName(false);
		}
	};

	// Обработчики для названий досок
	const handleBoardNameClick = (boardId: string) => {
		setEditingBoardId(boardId);
	};

	const handleBoardNameChange = (boardId: string, newName: string) => {
		const board = boards.find(b => b.id === boardId);
		if (!board) return;

		setBoardChanges(prev => ({
			...prev,
			[boardId]: {
				id: boardId,
				originalName: board.name,
				newName: newName,
				isDeleted: prev[boardId]?.isDeleted || false,
			},
		}));
	};

	const handleBoardNameKeyDown = (e: React.KeyboardEvent, boardId: string) => {
		if (e.key === 'Enter') {
			setEditingBoardId(null);
		} else if (e.key === 'Escape') {
			// Отменяем изменения для этой доски
			setBoardChanges(prev => {
				const newChanges = { ...prev };
				delete newChanges[boardId];
				return newChanges;
			});
			setEditingBoardId(null);
		}
	};

	// Обработчик удаления доски (локальное)
	const handleDeleteBoard = (boardId: string) => {
		const board = boards.find(b => b.id === boardId);
		if (!board) return;

		setBoardChanges(prev => ({
			...prev,
			[boardId]: {
				id: boardId,
				originalName: board.name,
				newName: prev[boardId]?.newName || board.name,
				isDeleted: true,
			},
		}));
	};

	// Обработчик отмены удаления доски
	const handleRestoreBoard = (boardId: string) => {
		setBoardChanges(prev => {
			const newChanges = { ...prev };
			if (newChanges[boardId]) {
				newChanges[boardId].isDeleted = false;
				// Если нет других изменений, удаляем запись
				if (newChanges[boardId].newName === newChanges[boardId].originalName) {
					delete newChanges[boardId];
				}
			}
			return newChanges;
		});
	};

	// Обработчики для колонок
	const handleColumnNameClick = (columnId: string) => {
		setEditingColumnId(columnId);
	};

	const handleColumnNameChange = (columnId: string, newName: string) => {
		const allColumns = boards.flatMap(board => board.columns || []);
		const column = allColumns.find(c => c.id === columnId);
		if (!column) return;

		setColumnChanges(prev => ({
			...prev,
			[columnId]: {
				id: columnId,
				originalName: column.name,
				newName: newName,
				isDeleted: prev[columnId]?.isDeleted || false,
				boardId: column.boardId,
			},
		}));
	};

	const handleColumnNameKeyDown = (
		e: React.KeyboardEvent,
		columnId: string
	) => {
		if (e.key === 'Enter') {
			setEditingColumnId(null);
		} else if (e.key === 'Escape') {
			// Отменяем изменения для этой колонки
			setColumnChanges(prev => {
				const newChanges = { ...prev };
				delete newChanges[columnId];
				return newChanges;
			});
			setEditingColumnId(null);
		}
	};

	const handleDeleteColumn = (columnId: string) => {
		const allColumns = boards.flatMap(board => board.columns || []);
		const column = allColumns.find(c => c.id === columnId);
		if (!column) return;

		setColumnChanges(prev => ({
			...prev,
			[columnId]: {
				id: columnId,
				originalName: column.name,
				newName: prev[columnId]?.newName || column.name,
				isDeleted: true,
				boardId: column.boardId,
			},
		}));
	};

	const handleRestoreColumn = (columnId: string) => {
		setColumnChanges(prev => {
			const newChanges = { ...prev };
			if (newChanges[columnId]) {
				newChanges[columnId].isDeleted = false;
				// Если нет других изменений, удаляем запись
				if (
					newChanges[columnId].newName === newChanges[columnId].originalName
				) {
					delete newChanges[columnId];
				}
			}
			return newChanges;
		});
	};

	// Применение всех изменений
	const handleSaveChanges = async () => {
		try {
			// Обновляем название проекта
			if (editedProjectName.trim() && editedProjectName !== project.name) {
				await updateProject(project.id, editedProjectName.trim());
			}

			// Применяем изменения досок
			for (const change of Object.values(boardChanges)) {
				if (change.isDeleted) {
					// Удаляем доску
					await deleteBoard(project.id, change.id);
				} else if (change.newName !== change.originalName) {
					// Обновляем название доски
					await updateBoard(project.id, change.id, change.newName.trim());
				}
			}

			// Применяем изменения колонок
			for (const change of Object.values(columnChanges)) {
				if (change.isDeleted) {
					// Удаляем колонку
					await deleteColumn(change.id);
				} else if (change.newName !== change.originalName) {
					// Обновляем название колонки
					await updateColumn(change.id, change.newName.trim());
				}
			}

			// Перезагружаем проекты для обновления UI
			await loadProjects();

			// Закрываем модалку
			onClose();
		} catch (error) {
			console.error('Error saving changes:', error);
		}
	};

	// Обработчик отмены (сбрасываем все изменения)
	const handleCancel = () => {
		setEditedProjectName(project.name);
		setBoardChanges({});
		setColumnChanges({});
		setEditingProjectName(false);
		setEditingBoardId(null);
		setEditingColumnId(null);
		onClose();
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={handleCancel}
		>
			<div
				className='bg-[#2c2c2e] w-[500px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{' '}
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<h2 className='text-xl font-semibold'>Project Settings</h2>
					<button onClick={handleCancel} disabled={loading}>
						<IoClose size={24} className='text-gray-400 hover:text-white' />
					</button>
				</div>
				<div className='p-4 overflow-y-auto max-h-[calc(80vh-120px)]'>
					{/* Project Name */}
					<div className='mb-6'>
						<h3 className='text-lg font-medium mb-2'>Project name</h3>
						<div className='flex items-center'>
							{editingProjectName ? (
								<input
									type='text'
									value={editedProjectName}
									onChange={e => setEditedProjectName(e.target.value)}
									onBlur={() => setEditingProjectName(false)}
									onKeyDown={handleProjectNameKeyDown}
									autoFocus
									className='bg-[#3c3c3e] text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
								/>
							) : (
								<div
									onClick={handleProjectNameClick}
									className='bg-[#3c3c3e] text-white px-3 py-2 rounded-md w-full cursor-pointer hover:bg-[#4c4c4e] transition-colors'
								>
									{editedProjectName}
								</div>
							)}
						</div>{' '}
						<p className='text-xs text-gray-400 mt-1'>Click to edit</p>
					</div>

					{/* Boards */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-lg font-medium'>Boards</h3>
						</div>
						{boards.length > 0 ? (
							<ul className='space-y-2'>
								{boards.map(board => {
									const isDeleted = isBoardDeleted(board);
									const displayName = getBoardDisplayName(board);

									return (
										<li
											key={board.id}
											className={`flex items-center justify-between p-3 rounded-md ${
												isDeleted
													? 'bg-red-900/20 border border-red-500/30'
													: 'bg-[#3c3c3e]'
											}`}
										>
											{editingBoardId === board.id ? (
												<input
													type='text'
													value={displayName}
													onChange={e =>
														handleBoardNameChange(board.id, e.target.value)
													}
													onBlur={() => setEditingBoardId(null)}
													onKeyDown={e => handleBoardNameKeyDown(e, board.id)}
													autoFocus
													className='bg-[#4c4c4e] text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ff9800]'
												/>
											) : (
												<div
													onClick={() =>
														!isDeleted && handleBoardNameClick(board.id)
													}
													className={`px-2 py-1 rounded flex-1 transition-colors ${
														isDeleted
															? 'text-red-400 line-through cursor-not-allowed'
															: 'cursor-pointer hover:bg-[#4c4c4e]'
													}`}
												>
													{displayName}{' '}
													{isDeleted && (
														<span className='ml-2 text-xs'>
															(will be deleted)
														</span>
													)}
												</div>
											)}
											<div className='flex items-center gap-1 ml-2'>
												{isDeleted ? (
													<button
														onClick={() => handleRestoreBoard(board.id)}
														className='text-green-400 hover:text-green-300 p-1'
														title='Restore board'
													>
														<IoClose size={18} className='rotate-45' />
													</button>
												) : (
													<button
														onClick={() => handleDeleteBoard(board.id)}
														className='text-gray-400 hover:text-red-500 p-1'
														title='Delete board'
													>
														<IoTrash size={16} />
													</button>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						) : (
							<div className='text-gray-400 text-center py-4'>
								No boards in this project
							</div>
						)}{' '}
						<p className='text-xs text-gray-400 mt-2'>
							Click on board name to edit
						</p>
					</div>

					{/* Columns */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-lg font-medium'>Columns</h3>
						</div>
						{boards.length > 0 ? (
							<div className='space-y-4'>
								{boards.map(board => {
									const boardColumns = board.columns || [];
									const boardDeleted = isBoardDeleted(board);

									return (
										<div
											key={board.id}
											className={`p-3 rounded-md ${
												boardDeleted ? 'opacity-50' : 'bg-[#3a3a3c]'
											}`}
										>
											<h4 className='text-md font-medium mb-2 text-[#ff9800]'>
												{getBoardDisplayName(board)}
												{boardDeleted && (
													<span className='ml-2 text-xs text-red-400'>
														(board will be deleted)
													</span>
												)}
											</h4>
											{boardColumns.length > 0 && !boardDeleted ? (
												<ul className='space-y-2'>
													{boardColumns.map(column => {
														const isDeleted = isColumnDeleted(column);
														const displayName = getColumnDisplayName(column);

														return (
															<li
																key={column.id}
																className={`flex items-center justify-between p-2 rounded-md ${
																	isDeleted
																		? 'bg-red-900/20 border border-red-500/30'
																		: 'bg-[#4c4c4e]'
																}`}
															>
																{editingColumnId === column.id ? (
																	<input
																		type='text'
																		value={displayName}
																		onChange={e =>
																			handleColumnNameChange(
																				column.id,
																				e.target.value
																			)
																		}
																		onBlur={() => setEditingColumnId(null)}
																		onKeyDown={e =>
																			handleColumnNameKeyDown(e, column.id)
																		}
																		autoFocus
																		className='bg-[#5c5c5e] text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ff9800]'
																	/>
																) : (
																	<div
																		onClick={() =>
																			!isDeleted &&
																			handleColumnNameClick(column.id)
																		}
																		className={`px-2 py-1 rounded flex-1 transition-colors ${
																			isDeleted
																				? 'text-red-400 line-through cursor-not-allowed'
																				: 'cursor-pointer hover:bg-[#5c5c5e]'
																		}`}
																	>
																		{displayName}
																		{isDeleted && (
																			<span className='ml-2 text-xs'>
																				(will be deleted)
																			</span>
																		)}
																	</div>
																)}
																<div className='flex items-center gap-1 ml-2'>
																	{isDeleted ? (
																		<button
																			onClick={() =>
																				handleRestoreColumn(column.id)
																			}
																			className='text-green-400 hover:text-green-300 p-1'
																			title='Restore column'
																		>
																			<IoClose
																				size={18}
																				className='rotate-45'
																			/>
																		</button>
																	) : (
																		<button
																			onClick={() =>
																				handleDeleteColumn(column.id)
																			}
																			className='text-gray-400 hover:text-red-500 p-1'
																			title='Delete column'
																		>
																			<IoTrash size={14} />
																		</button>
																	)}
																</div>
															</li>
														);
													})}
												</ul>
											) : (
												<div className='text-gray-400 text-sm py-2'>
													{boardDeleted
														? 'Board will be deleted'
														: 'No columns in this board'}
												</div>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className='text-gray-400 text-center py-4'>
								No boards in this project
							</div>
						)}
						<p className='text-xs text-gray-400 mt-2'>
							Click on column name to edit
						</p>
					</div>

					{/* Labels */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-lg font-medium'>Labels</h3>
							<button
								onClick={() => setShowLabelsModal(true)}
								className='px-3 py-1 bg-[#ff9800] hover:bg-[#f57c00] text-white rounded-md text-sm'
							>
								Manage Labels
							</button>
						</div>
						<p className='text-xs text-gray-400'>
							Click "Manage Labels" to add, edit, or delete project labels
						</p>
					</div>
				</div>
				<div className='flex justify-end gap-3 p-4 border-t border-[#3c3c3e]'>
					{' '}
					<button
						onClick={handleCancel}
						disabled={loading}
						className='px-4 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded-md disabled:opacity-50'
					>
						Cancel
					</button>
					<button
						onClick={handleSaveChanges}
						disabled={loading || !hasChanges()}
						className={`px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 ${
							hasChanges()
								? 'bg-[#ff9800] hover:bg-[#f57c00] text-white'
								: 'bg-[#3c3c3e] text-gray-400'
						}`}
					>
						<FiSave size={18} />
						{loading ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>

			{/* Labels Modal */}
			{showLabelsModal && (
				<LabelsModal
					isOpen={showLabelsModal}
					onClose={() => setShowLabelsModal(false)}
					projectId={project.id}
					projectName={project.name}
				/>
			)}
		</div>
	);
}
