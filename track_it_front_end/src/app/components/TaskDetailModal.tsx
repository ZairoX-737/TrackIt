import { useState, useEffect } from 'react';
import {
	IoClose,
	IoTrash,
	IoCheckmark,
	IoClose as IoCancel,
	IoDocumentTextOutline,
	IoPersonOutline,
	IoCalendarOutline,
	IoColorPaletteOutline,
	IoChatbubbleOutline,
	IoSaveOutline,
	IoCreateOutline,
	IoListOutline,
} from 'react-icons/io5';
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
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
			onClick={onClose}
		>
			<div
				className='bg-[rgba(10,10,10,0.95)] w-[900px] max-h-[90vh] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center px-6 py-4 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'>
					<div className='flex-1 min-w-0'>
						{isEditing ? (
							<div className='space-y-3'>
								<input
									type='text'
									value={editedTitle}
									onChange={e => setEditedTitle(e.target.value)}
									className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl text-lg font-semibold focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200'
									autoFocus
								/>
								<div className='flex items-center gap-3'>
									<IoListOutline className='text-blue-400' size={16} />
									<select
										value={editedColumnId}
										onChange={e => setEditedColumnId(e.target.value)}
										className='bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-all duration-200'
									>
										{columns.map(col => (
											<option
												key={col.id}
												value={col.id}
												className='bg-[rgba(10,10,10,0.95)]'
											>
												{col.name}
											</option>
										))}
									</select>
								</div>
							</div>
						) : (
							<div className='flex items-center gap-3'>
								<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent flex-1 min-w-0 truncate'>
									{task.title}
								</h2>
								<div className='inline-flex items-center gap-2 bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] px-3 py-1.5 rounded-xl text-blue-300 text-sm font-medium flex-shrink-0'>
									<IoListOutline size={14} />
									{columns.find(col => col.id === task.columnId)?.name ||
										'Unknown Column'}
								</div>
							</div>
						)}
					</div>

					<div className='flex items-center gap-3 flex-shrink-0 ml-4'>
						{!isEditing && (
							<button
								onClick={handleStartEdit}
								className='px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-lg'
								title='Edit task'
							>
								<IoCreateOutline size={16} />
								Edit
							</button>
						)}
						<button
							onClick={handleDeleteTask}
							className='p-2 text-[rgba(255,255,255,0.5)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] rounded-xl transition-all duration-200'
							title='Delete task'
						>
							<IoTrash size={18} />
						</button>
						<button
							onClick={onClose}
							className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105'
						>
							<IoClose size={20} />
						</button>
					</div>
				</div>{' '}
				{/* Content */}
				<div className='flex-1 overflow-hidden flex'>
					{/* Left side - Task details */}
					<div className='flex-1 p-6 overflow-y-auto custom-scrollbar'>
						{error && (
							<div className='mb-4 p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300 rounded-xl backdrop-blur-sm'>
								{error}
							</div>
						)}

						{/* Description Section */}
						<div className='mb-8'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='p-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl'>
									<IoDocumentTextOutline
										className='text-purple-400'
										size={18}
									/>
								</div>
								<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
									Description
								</h3>
							</div>
							{isEditing ? (
								<textarea
									value={editedDescription}
									onChange={e => setEditedDescription(e.target.value)}
									className='w-full h-32 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] resize-none transition-all duration-200 custom-scrollbar'
									placeholder='Add a detailed description...'
								/>
							) : (
								<div className='bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl min-h-[120px] backdrop-blur-sm'>
									{task.description ? (
										<p className='whitespace-pre-wrap break-words text-[rgba(255,255,255,0.9)] leading-relaxed'>
											{task.description}
										</p>
									) : (
										<p className='text-[rgba(255,255,255,0.5)] italic flex items-center justify-center h-full'>
											No description available
										</p>
									)}
								</div>
							)}
						</div>

						{/* Task Metadata */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
							<div className='bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl backdrop-blur-sm'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='p-1.5 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg'>
										<IoPersonOutline className='text-green-400' size={16} />
									</div>
									<h4 className='font-medium text-[rgba(255,255,255,0.9)]'>
										Created by
									</h4>
								</div>
								<p className='text-[rgba(255,255,255,0.7)] ml-8'>
									{task.user?.username || task.user?.email || 'Unknown User'}
								</p>
							</div>
							<div className='bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl backdrop-blur-sm'>
								<div className='flex items-center gap-3 mb-2'>
									<div className='p-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg'>
										<IoCalendarOutline className='text-blue-400' size={16} />
									</div>
									<h4 className='font-medium text-[rgba(255,255,255,0.9)]'>
										Created
									</h4>
								</div>
								<p className='text-[rgba(255,255,255,0.7)] ml-8'>
									{new Date(task.createdAt).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</p>
							</div>
						</div>

						{/* Labels Section */}
						<div className='mb-8'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl'>
									<IoColorPaletteOutline
										className='text-orange-400'
										size={18}
									/>
								</div>
								<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
									Labels
								</h3>
							</div>

							{showLabelSelector && isEditing && (
								<div className='bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl mb-4 backdrop-blur-sm'>
									<div className='flex flex-wrap gap-2'>
										{labels.map(label => (
											<button
												key={label.id}
												type='button'
												onClick={() => handleToggleLabel(label.id)}
												className={`
													inline-flex items-center justify-center
													px-3 py-1.5 text-xs font-medium
													rounded-full transition-all duration-200
													border-2 min-w-[40px] h-[28px]
													hover:scale-105 hover:shadow-lg
													${
														selectedLabels.includes(label.id)
															? 'border-white shadow-lg transform scale-105 ring-2 ring-white/20'
															: 'border-transparent hover:border-white/30'
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
								</div>
							)}

							<div className='bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] p-4 rounded-xl backdrop-blur-sm'>
								{!isEditing && (
									<div className='flex flex-wrap gap-2'>
										{task.labels && task.labels.length > 0 ? (
											task.labels.map((labelData: any) => {
												// Handle different label formats
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
														className='inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full min-w-[40px] h-[28px] shadow-sm'
														style={{
															backgroundColor: color,
															color: color === '#D1FF86' ? '#000' : '#fff',
														}}
													>
														{name}
													</span>
												);
											})
										) : (
											<span className='text-[rgba(255,255,255,0.5)] italic'>
												No labels assigned
											</span>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Edit Action Buttons */}
						{isEditing && (
							<div className='flex gap-3 pt-6 border-t border-[rgba(255,255,255,0.1)]'>
								<button
									onClick={handleSaveEdit}
									className='px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
								>
									<IoSaveOutline size={16} />
									Save Changes
								</button>
								<button
									onClick={handleCancelEdit}
									className='px-6 py-3 bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.15)] text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 border border-[rgba(255,255,255,0.2)]'
								>
									<IoCancel size={16} />
									Cancel
								</button>
							</div>
						)}
					</div>{' '}
					{/* Right side - Comments */}
					<div className='w-80 border-l border-[rgba(255,255,255,0.1)] flex flex-col bg-[rgba(255,255,255,0.02)]'>
						<div className='p-6 border-b border-[rgba(255,255,255,0.1)]'>
							<div className='flex items-center gap-3'>
								<div className='p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl'>
									<IoChatbubbleOutline className='text-blue-400' size={18} />
								</div>
								<h3 className='font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
									Comments ({comments.length})
								</h3>
							</div>
						</div>
						<div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
							{loading ? (
								<div className='flex items-center justify-center py-8'>
									<div className='flex items-center gap-3 text-[rgba(255,255,255,0.6)]'>
										<div className='w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin'></div>
										Loading comments...
									</div>
								</div>
							) : (
								<div className='space-y-4'>
									{comments.map(comment => (
										<div
											key={comment.id}
											className='bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-4 rounded-xl backdrop-blur-sm hover:bg-[rgba(255,255,255,0.08)] transition-all duration-200'
										>
											<div className='flex justify-between items-start mb-3'>
												<div className='flex items-center gap-3'>
													<div className='w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium'>
														{(comment.user.username || comment.user.email)
															?.charAt(0)
															.toUpperCase()}
													</div>
													<div>
														<span className='font-medium text-white text-sm'>
															{comment.user.username || comment.user.email}
														</span>
														<span className='text-xs text-[rgba(255,255,255,0.5)] ml-2'>
															{new Date(comment.createdAt).toLocaleString(
																'en-US',
																{
																	month: 'short',
																	day: 'numeric',
																	hour: '2-digit',
																	minute: '2-digit',
																}
															)}
														</span>
													</div>
												</div>
												<button
													onClick={() => handleDeleteComment(comment.id)}
													className='text-[rgba(255,255,255,0.4)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] p-1.5 rounded-lg transition-all duration-200'
													title='Delete comment'
												>
													<IoTrash size={14} />
												</button>
											</div>
											<p className='text-sm text-[rgba(255,255,255,0.9)] whitespace-pre-wrap leading-relaxed pl-11'>
												{comment.content}
											</p>
										</div>
									))}
									{comments.length === 0 && (
										<div className='text-center py-12'>
											<div className='mb-4'>
												<IoChatbubbleOutline
													className='mx-auto text-[rgba(255,255,255,0.3)]'
													size={48}
												/>
											</div>
											<p className='text-[rgba(255,255,255,0.5)] font-medium'>
												No comments yet
											</p>
											<p className='text-[rgba(255,255,255,0.3)] text-sm mt-1'>
												Start the conversation below
											</p>
										</div>
									)}
								</div>
							)}
						</div>
						{/* Add comment form */}
						<div className='p-4 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'>
							<form onSubmit={handleAddComment} className='space-y-3'>
								<textarea
									value={newComment}
									onChange={e => setNewComment(e.target.value)}
									placeholder='Add a comment...'
									className='w-full h-20 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white p-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] resize-none transition-all duration-200 custom-scrollbar'
								/>
								<button
									type='submit'
									disabled={!newComment.trim()}
									className='w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none'
								>
									Add Comment
								</button>
							</form>
						</div>{' '}
					</div>
				</div>
			</div>
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 153, 0, 0.6);
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 153, 0, 0.8);
				}
			`}</style>
		</div>
	);
}
