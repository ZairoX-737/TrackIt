import { useState, useEffect } from 'react';
import {
	IoClose,
	IoTrash,
	IoCheckmark,
	IoClose as IoCancel,
} from 'react-icons/io5';
import {
	FiMessageSquare,
	FiUser,
	FiCalendar,
	FiTag,
	FiPlus,
} from 'react-icons/fi';
import {
	Task,
	CommentService,
	Comment,
	TaskService,
	Label,
	LabelService,
} from '../api';
import { useTaskStore } from '../store/taskStore';

interface TaskDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
	onTaskUpdate?: (updatedTask: Task) => void;
	onTaskDelete?: (taskId: string) => void;
	projectId?: string;
}

export default function TaskDetailModal({
	isOpen,
	onClose,
	task,
	onTaskUpdate,
	onTaskDelete,
	projectId,
}: TaskDetailModalProps) {
	const { columns } = useTaskStore();
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState('');
	const [editedDescription, setEditedDescription] = useState('');
	const [labels, setLabels] = useState<Label[]>([]);
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [showLabelSelector, setShowLabelSelector] = useState(false);
	const [editedColumnId, setEditedColumnId] = useState('');
	useEffect(() => {
		if (isOpen && task) {
			setEditedTitle(task.title);
			setEditedDescription(task.description || '');
			setEditedColumnId(task.columnId);
			loadComments();
			loadLabels();

			// Устанавливаем выбранные метки из задачи
			if (task.labels && task.labels.length > 0) {
				const labelIds = task.labels.map((label: any) => {
					if (typeof label === 'string') return label;
					else if (label.label) return label.label.id;
					else return label.id;
				});
				setSelectedLabels(labelIds);
			} else {
				setSelectedLabels([]);
			}
		}
	}, [isOpen, task]);

	const loadLabels = async () => {
		try {
			const data = projectId
				? await LabelService.getByProject(projectId)
				: await LabelService.getAll();
			setLabels(data);
		} catch (err: any) {
			console.error('Failed to load labels:', err);
		}
	};

	const loadComments = async () => {
		if (!task) return;

		try {
			setLoading(true);
			setError(null);
			const data = await CommentService.getTaskComments(task.id);
			setComments(data);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to load comments');
		} finally {
			setLoading(false);
		}
	};

	const handleAddComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!task || !newComment.trim()) return;

		try {
			setError(null);
			const comment = await CommentService.createComment(
				task.id,
				newComment.trim()
			);
			setComments([comment, ...comments]);
			setNewComment('');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to add comment');
		}
	};

	const handleDeleteComment = async (commentId: string) => {
		try {
			setError(null);
			await CommentService.deleteComment(commentId);
			setComments(comments.filter(c => c.id !== commentId));
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to delete comment');
		}
	};
	const handleSaveEdit = async () => {
		if (!task) return;
		try {
			setError(null);
			const updatedTask = await TaskService.update(task.id, {
				title: editedTitle,
				description: editedDescription,
				labelIds: selectedLabels,
				columnId: editedColumnId,
			});
			setIsEditing(false);
			onTaskUpdate?.(updatedTask);
		} catch (err: any) {
			console.error('Error updating task:', err);
			setError(err.response?.data?.message || 'Failed to update task');
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setShowLabelSelector(false); // Закрываем панель меток при отмене
		setEditedTitle(task?.title || '');
		setEditedDescription(task?.description || '');
		setEditedColumnId(task?.columnId || '');
		// Сбрасываем выбранные метки к исходному состоянию
		if (task?.labels && task.labels.length > 0) {
			const labelIds = task.labels.map((label: any) => {
				if (typeof label === 'string') return label;
				else if (label.label) return label.label.id;
				else return label.id;
			});
			setSelectedLabels(labelIds);
		} else {
			setSelectedLabels([]);
		}
	};

	const handleStartEdit = () => {
		setIsEditing(true);
		setShowLabelSelector(true); // Автоматически открываем панель меток
	};

	const handleToggleLabel = (labelId: string) => {
		setSelectedLabels(prevSelectedLabels => {
			if (prevSelectedLabels.includes(labelId)) {
				return prevSelectedLabels.filter(id => id !== labelId);
			} else {
				return [...prevSelectedLabels, labelId];
			}
		});
	};
	const handleDeleteTask = async () => {
		if (!task) return;

		if (confirm('Are you sure you want to delete this task?')) {
			try {
				setError(null);
				// Выполняем API вызов для удаления задачи
				await TaskService.delete(task.id);
				// При успешном удалении обновляем локальное состояние и закрываем модальное окно
				onTaskDelete?.(task.id);
				onClose();
			} catch (err: any) {
				console.error('Error deleting task:', err);
				setError(err.response?.data?.message || 'Failed to delete task');
				// НЕ закрываем модальное окно при ошибке, чтобы пользователь видел сообщение об ошибке
			}
		}
	};

	if (!isOpen || !task) return null;
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[800px] max-h-[90vh] rounded-lg shadow-lg overflow-hidden flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				{' '}
				{/* Header */}
				<div className='flex justify-between items-center px-4 py-3 border-b border-[#3c3c3e] gap-4'>
					<div className='flex-1 min-w-0'>
						{isEditing ? (
							<div className='space-y-2'>
								<input
									type='text'
									value={editedTitle}
									onChange={e => setEditedTitle(e.target.value)}
									className='w-full bg-[#3c3c3e] text-white px-2 py-1 rounded text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
									autoFocus
								/>
								<div className='flex items-center gap-2'>
									{/* Селектор колонки */}
									<select
										value={editedColumnId}
										onChange={e => setEditedColumnId(e.target.value)}
										className='bg-[#3c3c3e] text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
									>
										{columns.map(col => (
											<option key={col.id} value={col.id}>
												{col.name}
											</option>
										))}
									</select>
								</div>
							</div>
						) : (
							<div className='flex items-center gap-2'>
								<h2 className='text-lg font-semibold leading-snug flex-1 min-w-0 truncate'>
									{task.title}
								</h2>
								{/* Column indicator */}
								<div className='inline-block bg-[#3c3c3e] px-1.5 py-0.5 rounded-full text-xs text-gray-300 border border-[#4c4c4e] flex-shrink-0'>
									{columns.find(col => col.id === task.columnId)?.name ||
										'Unknown Column'}
								</div>
							</div>
						)}
					</div>

					<div className='flex items-center gap-2 flex-shrink-0'>
						{!isEditing && (
							<button
								onClick={handleStartEdit}
								className='bg-[#ff9800] hover:bg-[#f57c00] text-white px-3 py-1 rounded text-sm whitespace-nowrap'
								title='Edit task'
							>
								Edit
							</button>
						)}
						<button
							onClick={handleDeleteTask}
							className='text-red-500 hover:text-red-400 flex-shrink-0'
							title='Delete task'
						>
							<IoTrash size={20} />
						</button>
						<button onClick={onClose} className='flex-shrink-0'>
							<IoClose size={24} className='text-gray-400 hover:text-white' />
						</button>
					</div>
				</div>
				{/* Content */}
				<div className='flex-1 overflow-hidden flex'>
					{' '}
					{/* Left side - Task details */}
					<div className='flex-1 p-4 overflow-y-auto'>
						{error && (
							<div className='mb-4 p-3 bg-red-600 text-white rounded-md'>
								{error}
							</div>
						)}

						{/* Description */}
						<div className='mb-6'>
							<h3 className='text-lg font-medium mb-2'>Description</h3>
							{isEditing ? (
								<textarea
									value={editedDescription}
									onChange={e => setEditedDescription(e.target.value)}
									className='w-full h-32 bg-[#3c3c3e] text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800] resize-none break-words overflow-wrap-anywhere'
									placeholder='Add a description...'
								/>
							) : (
								<div className='bg-[#3c3c3e] p-3 rounded-md min-h-[100px]'>
									{task.description ? (
										<p className='whitespace-pre-wrap break-words overflow-wrap-anywhere'>
											{task.description}
										</p>
									) : (
										<p className='text-gray-400 italic'>
											No description available
										</p>
									)}
								</div>
							)}
						</div>

						{/* Task metadata */}
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<h4 className='font-medium mb-1 flex items-center gap-2'>
									<FiUser size={16} />
									Created by
								</h4>
								<p className='text-gray-400'>
									{task.user?.username || task.user?.email || 'Unknown'}
								</p>
							</div>
							<div>
								<h4 className='font-medium mb-1 flex items-center gap-2'>
									<FiCalendar size={16} />
									Created
								</h4>
								<p className='text-gray-400'>
									{new Date(task.createdAt).toLocaleDateString()}
								</p>
							</div>
							<div className='col-span-2'>
								<h4 className='font-medium mb-1 flex items-center gap-2'>
									<FiTag size={16} />
									Labels
								</h4>
								{showLabelSelector && isEditing && (
									<div className='flex flex-wrap gap-2 mb-2'>
										{labels.map(label => (
											<button
												key={label.id}
												type='button'
												onClick={() => handleToggleLabel(label.id)}
												className={`
													inline-flex items-center justify-center
													px-3 py-1 text-xs font-medium
													rounded-full transition-all duration-200
													border-2 min-w-[30px] h-[20px]
													${
														selectedLabels.includes(label.id)
															? 'border-white shadow-lg transform scale-105'
															: 'border-transparent hover:border-gray-300'
													}
												`}
												style={{
													backgroundColor: label.color,
													color: label.color === '#D1FF86' ? '#000' : '#fff',
												}}
											>
												{label.name}
											</button>
										))}
									</div>
								)}
								{!isEditing && (
									<div className='flex flex-wrap gap-1'>
										{task.labels && task.labels.length > 0 ? (
											task.labels.map((labelData: any) => {
												// Обрабатываем разные форматы меток
												let id = '';
												let name = '';
												let color = '';

												if (typeof labelData === 'string') {
													id = labelData;
													name = labelData;
													color = labelData;
												} else if (labelData.label) {
													id = labelData.label.id;
													name = labelData.label.name;
													color = labelData.label.color;
												} else {
													id = labelData.id;
													name = labelData.name;
													color = labelData.color;
												}

												return (
													<span
														key={id}
														className='text-xs px-2 py-1 rounded'
														style={{ backgroundColor: color, color: 'white' }}
													>
														{name}
													</span>
												);
											})
										) : (
											<span className='text-xs text-gray-400'>No labels</span>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Edit Action Buttons */}
						{isEditing && (
							<div className='flex gap-2 mt-6 pt-4 border-t border-[#3c3c3e]'>
								<button
									onClick={handleSaveEdit}
									className='bg-[#ff9800] hover:bg-[#f57c00] text-white px-4 py-2 rounded text-sm flex items-center gap-2'
								>
									<IoCheckmark size={16} />
									Save Changes
								</button>
								<button
									onClick={handleCancelEdit}
									className='bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm flex items-center gap-2'
								>
									<IoCancel size={16} />
									Cancel
								</button>
							</div>
						)}
					</div>
					{/* Right side - Comments */}
					<div className='w-80 border-l border-[#3c3c3e] flex flex-col'>
						<div className='p-4 border-b border-[#3c3c3e]'>
							<h3 className='font-medium flex items-center gap-2'>
								<FiMessageSquare size={18} />
								Comments ({comments.length})
							</h3>
						</div>

						<div className='flex-1 overflow-y-auto p-4'>
							{loading ? (
								<div className='text-center py-4'>Loading comments...</div>
							) : (
								<div className='space-y-3'>
									{comments.map(comment => (
										<div
											key={comment.id}
											className='bg-[#3c3c3e] p-3 rounded-md'
										>
											<div className='flex justify-between items-start mb-2'>
												<div>
													<span className='font-medium text-sm'>
														{comment.user.username || comment.user.email}
													</span>
													<span className='text-xs text-gray-400 ml-2'>
														{new Date(comment.createdAt).toLocaleDateString()}
													</span>
												</div>
												<button
													onClick={() => handleDeleteComment(comment.id)}
													className='text-gray-400 hover:text-red-500 text-xs'
													title='Delete comment'
												>
													<IoTrash size={14} />
												</button>
											</div>
											<p className='text-sm whitespace-pre-wrap'>
												{comment.content}
											</p>
										</div>
									))}
									{comments.length === 0 && (
										<div className='text-center py-4 text-gray-400'>
											No comments yet
										</div>
									)}
								</div>
							)}
						</div>

						{/* Add comment form */}
						<div className='p-4 border-t border-[#3c3c3e]'>
							<form onSubmit={handleAddComment} className='space-y-2'>
								<textarea
									value={newComment}
									onChange={e => setNewComment(e.target.value)}
									placeholder='Add a comment...'
									className='w-full h-20 bg-[#2c2c2e] text-white p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#ff9800] resize-none'
								/>
								<button
									type='submit'
									disabled={!newComment.trim()}
									className='w-full bg-[#ff9800] hover:bg-[#f57c00] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 rounded-md text-sm'
								>
									Add Comment
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
