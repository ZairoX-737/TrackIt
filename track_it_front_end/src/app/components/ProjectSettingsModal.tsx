import { useState, useEffect } from 'react';
import {
	IoClose,
	IoTrash,
	IoSettingsOutline,
	IoColorPaletteOutline,
	IoBusiness,
	IoGrid,
	IoListOutline,
	IoRefreshOutline,
	IoSaveOutline,
} from 'react-icons/io5';
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

	// Используем свежие данные проекта из store вместо переданных пропсов
	const { projects } = useTaskStore();
	const currentProject = projects.find(p => p.id === project.id) || project;
	const boards = currentProject.boards || [];

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
	}; // Применение всех изменений
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

			console.log('Changes saved successfully');

			// Закрываем модалку после успешного сохранения
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
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2100]'
			onClick={handleCancel}
		>
			<div
				className='bg-[rgba(10,10,10,0.95)] w-[800px] max-h-[85vh] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-6 pb-4'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-[rgba(255,152,0,0.15)]'>
							<IoSettingsOutline className='text-orange-400' size={20} />
						</div>
						<div>
							<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
								Project Settings
							</h2>
							<p className='text-sm text-[rgba(255,255,255,0.6)]'>
								Manage your project, boards and columns
							</p>
						</div>
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={() => setShowLabelsModal(true)}
							className='flex items-center gap-2 px-4 py-2 bg-[rgba(255,152,0,0.15)] hover:bg-[rgba(255,152,0,0.25)] text-orange-400 hover:text-orange-300 rounded-xl transition-all duration-200 border border-[rgba(255,152,0,0.3)]'
						>
							<IoColorPaletteOutline size={16} />
							<span className='text-sm font-medium'>Labels</span>
						</button>
						<button
							onClick={handleCancel}
							disabled={loading}
							className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 disabled:opacity-50'
						>
							<IoClose size={20} />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className='px-6 pb-6 overflow-y-auto max-h-[calc(85vh-160px)] space-y-6'>
					{/* Project Name Section */}
					<div className='bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-[rgba(255,255,255,0.08)]'>
						<div className='flex items-center gap-2 mb-4'>
							<IoBusiness className='text-orange-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>Project Name</h3>
						</div>
						<div className='relative'>
							{editingProjectName ? (
								<input
									type='text'
									value={editedProjectName}
									onChange={e => setEditedProjectName(e.target.value)}
									onBlur={() => setEditingProjectName(false)}
									onKeyDown={handleProjectNameKeyDown}
									autoFocus
									className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 text-lg'
									placeholder='Enter project name'
								/>
							) : (
								<div
									onClick={handleProjectNameClick}
									className='w-full bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-lg'
								>
									{editedProjectName}
								</div>
							)}
						</div>
						<p className='text-xs text-[rgba(255,255,255,0.5)] mt-2'>
							Click to edit project name
						</p>
					</div>

					{/* Boards Section */}
					<div className='bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-[rgba(255,255,255,0.08)]'>
						<div className='flex items-center gap-2 mb-4'>
							<IoGrid className='text-purple-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>Boards</h3>
							<span className='bg-[rgba(147,51,234,0.2)] text-purple-300 px-2 py-1 rounded-full text-xs font-medium'>
								{boards.filter(board => !isBoardDeleted(board)).length}
							</span>
						</div>
						{boards.length > 0 ? (
							<div className='space-y-3'>
								{boards.map(board => {
									const isDeleted = isBoardDeleted(board);
									const displayName = getBoardDisplayName(board);

									return (
										<div
											key={board.id}
											className={`p-4 rounded-xl border transition-all duration-200 ${
												isDeleted
													? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] opacity-75'
													: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
											}`}
										>
											<div className='flex items-center justify-between'>
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
														className='flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-3 py-2 rounded-lg focus:outline-none focus:border-orange-400 transition-all duration-200'
													/>
												) : (
													<div
														onClick={() =>
															!isDeleted && handleBoardNameClick(board.id)
														}
														className={`flex-1 px-3 py-2 rounded-lg transition-all duration-200 ${
															isDeleted
																? 'text-red-400 line-through cursor-not-allowed'
																: 'text-white cursor-pointer hover:bg-[rgba(255,255,255,0.05)]'
														}`}
													>
														<div className='flex items-center gap-2'>
															<IoGrid
																size={16}
																className={
																	isDeleted ? 'text-red-400' : 'text-purple-400'
																}
															/>
															<span className='font-medium'>{displayName}</span>
															{isDeleted && (
																<span className='text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full'>
																	Will be deleted
																</span>
															)}
														</div>
													</div>
												)}
												<div className='flex items-center gap-2 ml-3'>
													{isDeleted ? (
														<button
															onClick={() => handleRestoreBoard(board.id)}
															className='p-2 text-green-400 hover:text-green-300 hover:bg-[rgba(34,197,94,0.1)] rounded-lg transition-all duration-200'
															title='Restore board'
														>
															<IoRefreshOutline size={16} />
														</button>
													) : (
														<button
															onClick={() => handleDeleteBoard(board.id)}
															className='p-2 text-[rgba(255,255,255,0.5)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-all duration-200'
															title='Delete board'
														>
															<IoTrash size={16} />
														</button>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
								<IoGrid size={32} className='mx-auto mb-2 opacity-50' />
								<p>No boards in this project</p>
							</div>
						)}
						<p className='text-xs text-[rgba(255,255,255,0.5)] mt-3'>
							Click on board name to edit
						</p>
					</div>

					{/* Columns Section */}
					<div className='bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-[rgba(255,255,255,0.08)]'>
						<div className='flex items-center gap-2 mb-4'>
							<IoListOutline className='text-blue-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>Columns</h3>
							<span className='bg-[rgba(59,130,246,0.2)] text-blue-300 px-2 py-1 rounded-full text-xs font-medium'>
								{boards.reduce(
									(total, board) =>
										total +
										(board.columns?.filter(col => !isColumnDeleted(col))
											.length || 0),
									0
								)}
							</span>
						</div>
						{boards.length > 0 ? (
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
								{boards.map(board => {
									const boardColumns = board.columns || [];
									const boardDeleted = isBoardDeleted(board);

									return (
										<div
											key={board.id}
											className={`p-4 rounded-xl border transition-all duration-200 ${
												boardDeleted
													? 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.2)] opacity-50'
													: 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]'
											}`}
										>
											<div className='flex items-center gap-2 mb-3'>
												<IoGrid
													size={16}
													className={
														boardDeleted ? 'text-red-400' : 'text-purple-400'
													}
												/>
												<h4 className='font-medium text-white truncate'>
													{getBoardDisplayName(board)}
												</h4>
												{boardDeleted && (
													<span className='text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full'>
														Deleting
													</span>
												)}
											</div>
											{boardColumns.length > 0 && !boardDeleted ? (
												<div className='space-y-2'>
													{boardColumns.map(column => {
														const isDeleted = isColumnDeleted(column);
														const displayName = getColumnDisplayName(column);

														return (
															<div
																key={column.id}
																className={`p-3 rounded-lg border transition-all duration-200 ${
																	isDeleted
																		? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)]'
																		: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
																}`}
															>
																<div className='flex items-center justify-between'>
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
																			className='flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-2 py-1 rounded focus:outline-none focus:border-orange-400 transition-all duration-200 text-sm'
																		/>
																	) : (
																		<div
																			onClick={() =>
																				!isDeleted &&
																				handleColumnNameClick(column.id)
																			}
																			className={`flex-1 px-2 py-1 rounded transition-all duration-200 ${
																				isDeleted
																					? 'text-red-400 line-through cursor-not-allowed'
																					: 'text-white cursor-pointer hover:bg-[rgba(255,255,255,0.05)]'
																			}`}
																		>
																			<div className='flex items-center gap-2'>
																				<IoListOutline
																					size={14}
																					className={
																						isDeleted
																							? 'text-red-400'
																							: 'text-blue-400'
																					}
																				/>
																				<span className='text-sm'>
																					{displayName}
																				</span>
																				{isDeleted && (
																					<span className='text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full'>
																						Delete
																					</span>
																				)}
																			</div>
																		</div>
																	)}
																	<div className='flex items-center gap-1 ml-2'>
																		{isDeleted ? (
																			<button
																				onClick={() =>
																					handleRestoreColumn(column.id)
																				}
																				className='p-1 text-green-400 hover:text-green-300 hover:bg-[rgba(34,197,94,0.1)] rounded transition-all duration-200'
																				title='Restore column'
																			>
																				<IoRefreshOutline size={14} />
																			</button>
																		) : (
																			<button
																				onClick={() =>
																					handleDeleteColumn(column.id)
																				}
																				className='p-1 text-[rgba(255,255,255,0.5)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] rounded transition-all duration-200'
																				title='Delete column'
																			>
																				<IoTrash size={12} />
																			</button>
																		)}
																	</div>
																</div>
															</div>
														);
													})}
												</div>
											) : (
												<div className='text-center py-4 text-[rgba(255,255,255,0.4)]'>
													<IoListOutline
														size={24}
														className='mx-auto mb-1 opacity-50'
													/>
													<p className='text-xs'>
														{boardDeleted
															? 'Board will be deleted'
															: 'No columns in this board'}
													</p>
												</div>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
								<IoListOutline size={32} className='mx-auto mb-2 opacity-50' />
								<p>No boards in this project</p>
							</div>
						)}
						<p className='text-xs text-[rgba(255,255,255,0.5)] mt-3'>
							Click on column name to edit
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className='flex justify-between items-center px-6 py-4 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'>
					<div className='text-sm text-[rgba(255,255,255,0.6)]'>
						{hasChanges() && (
							<span className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-orange-400 rounded-full animate-pulse'></div>
								Unsaved changes
							</span>
						)}
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={handleCancel}
							disabled={loading}
							className='px-6 py-2.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50'
						>
							Cancel
						</button>
						<button
							onClick={handleSaveChanges}
							disabled={loading || !hasChanges()}
							className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
								hasChanges()
									? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg'
									: 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]'
							}`}
						>
							{loading ? (
								<>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									Saving...
								</>
							) : (
								<>
									<IoSaveOutline size={16} />
									Save Changes
								</>
							)}
						</button>
					</div>
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
