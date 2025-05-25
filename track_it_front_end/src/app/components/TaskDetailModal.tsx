import { useState, useEffect } from 'react';
import {
	IoClose,
	IoTrash,
	IoPencil,
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
}

export default function TaskDetailModal({
	isOpen,
	onClose,
	task,
	onTaskUpdate,
	onTaskDelete,
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
	const [editedStatus, setEditedStatus] = useState('');
	const [editedColumnId, setEditedColumnId] = useState('');
	useEffect(() => {
		if (isOpen && task) {
			setEditedTitle(task.title);
			setEditedDescription(task.description || '');
			setEditedStatus(task.status || 'todo');
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
			const data = await LabelService.getAll();
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
				status: editedStatus,
				priority: task.priority,
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
		setEditedTitle(task?.title || '');
		setEditedDescription(task?.description || '');
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
				await TaskService.delete(task.id);
				onTaskDelete?.(task.id);
				onClose();
			} catch (err: any) {
				console.error('Error deleting task:', err);
				setError(err.response?.data?.message || 'Failed to delete task');
			}
		}
	};

	if (!isOpen || !task) return null;

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[800px] max-h-[90vh] rounded-lg shadow-lg overflow-hidden flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<div className='flex items-center gap-3'>
						{isEditing ? (
							<input
								type='text'
								value={editedTitle}
								onChange={e => setEditedTitle(e.target.value)}
								className='bg-[#3c3c3e] text-white px-2 py-1 rounded text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
								autoFocus
							/>
						) : (
							<h2 className='text-xl font-semibold'>{task.title}</h2>
						)}

						{isEditing && (
							<div className='flex gap-2'>
								{/* Селектор статуса */}
								<select
									value={editedStatus}
									onChange={e => setEditedStatus(e.target.value)}
									className='bg-[#3c3c3e] text-white px-2 py-1 rounded text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
								>
									<option value='todo'>To Do</option>
									<option value='in_progress'>In Progress</option>
									<option value='done'>Done</option>
								</select>
								{/* Селектор колонки */}
								<select
									value={editedColumnId}
									onChange={e => setEditedColumnId(e.target.value)}
									className='bg-[#3c3c3e] text-white px-2 py-1 rounded text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
								>
									{columns.map(col => (
										<option key={col.id} value={col.id}>
											{col.name}
										</option>
									))}
								</select>
							</div>
						)}

						{isEditing ? (
							<div className='flex gap-2'>
								<button
									onClick={handleSaveEdit}
									className='text-green-500 hover:text-green-400'
									title='Save changes'
								>
									<IoCheckmark size={20} />
								</button>
								<button
									onClick={handleCancelEdit}
									className='text-red-500 hover:text-red-400'
									title='Cancel editing'
								>
									<IoCancel size={20} />
								</button>
							</div>
						) : (
							<button
								onClick={() => setIsEditing(true)}
								className='text-gray-400 hover:text-white'
								title='Edit task'
							>
								<IoPencil size={18} />
							</button>
						)}
					</div>

					<div className='flex items-center gap-2'>
						<button
							onClick={handleDeleteTask}
							className='text-red-500 hover:text-red-400'
							title='Delete task'
						>
							<IoTrash size={20} />
						</button>
						<button onClick={onClose}>
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
							<h3 className='text-lg font-medium mb-2 flex justify-between'>
								Description
								{!isEditing && (
									<button
										onClick={() => setIsEditing(true)}
										className='text-xs bg-[#3c3c3e] hover:bg-[#4c4c4e] px-2 py-1 rounded'
									>
										Edit
									</button>
								)}
							</h3>
							{isEditing ? (
								<textarea
									value={editedDescription}
									onChange={e => setEditedDescription(e.target.value)}
									className='w-full h-32 bg-[#3c3c3e] text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800] resize-none'
									placeholder='Add a description...'
								/>
							) : (
								<div className='bg-[#3c3c3e] p-3 rounded-md min-h-[100px]'>
									{task.description ? (
										<p className='whitespace-pre-wrap'>{task.description}</p>
									) : (
										<p className='text-gray-400 italic'>
											No description available
										</p>
									)}
								</div>
							)}
						</div>

						{isEditing && (
							<div className='mb-6'>
								<div className='flex justify-end'>
									<button
										onClick={handleSaveEdit}
										className='bg-[#ff9800] hover:bg-[#f57c00] text-white px-4 py-2 rounded-md mr-2'
									>
										Сохранить изменения
									</button>
									<button
										onClick={handleCancelEdit}
										className='bg-[#3c3c3e] hover:bg-[#4c4c4e] text-white px-4 py-2 rounded-md'
									>
										Отмена
									</button>
								</div>
							</div>
						)}

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
							{task.priority && (
								<div>
									<h4 className='font-medium mb-1'>Priority</h4>
									<span
										className={`text-sm px-2 py-1 rounded ${
											task.priority === 'high'
												? 'bg-red-600 text-white'
												: task.priority === 'medium'
												? 'bg-yellow-600 text-white'
												: 'bg-green-600 text-white'
										}`}
									>
										{task.priority.charAt(0).toUpperCase() +
											task.priority.slice(1)}
									</span>
								</div>
							)}{' '}
							<div>
								<h4 className='font-medium mb-1 flex items-center justify-between'>
									<span className='flex items-center gap-2'>
										<FiTag size={16} />
										Labels
									</span>
									{isEditing && (
										<button
											onClick={() => setShowLabelSelector(!showLabelSelector)}
											className='text-xs bg-[#3c3c3e] hover:bg-[#4c4c4e] px-2 py-1 rounded flex items-center gap-1'
										>
											{showLabelSelector ? 'Hide' : 'Edit'} Labels
										</button>
									)}
								</h4>
								{showLabelSelector && isEditing && (
									<div className='bg-[#252528] border border-[#3c3c3e] p-3 rounded-md mb-2'>
										<div className='mb-2 font-medium text-sm'>
											Select Labels:
										</div>
										<div className='grid grid-cols-2 gap-2 max-h-32 overflow-y-auto'>
											{labels.map(label => (
												<div
													key={label.id}
													className={`flex items-center p-2 rounded cursor-pointer ${
														selectedLabels.includes(label.id)
															? 'bg-[#3c3c3e]'
															: 'hover:bg-[#2c2c2e]'
													}`}
													onClick={() => handleToggleLabel(label.id)}
												>
													<span
														className='w-3 h-3 rounded-full mr-2'
														style={{ backgroundColor: label.color }}
													></span>
													<span className='text-sm'>{label.name}</span>
													{selectedLabels.includes(label.id) && (
														<IoCheckmark
															size={16}
															className='ml-auto text-green-500'
														/>
													)}
												</div>
											))}
										</div>
										{labels.length === 0 && (
											<p className='text-sm text-gray-400'>
												No labels available
											</p>
										)}
									</div>
								)}
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
							</div>
						</div>
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
