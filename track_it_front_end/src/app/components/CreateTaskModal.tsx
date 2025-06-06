import React, { forwardRef, Ref, useEffect, useState } from 'react';
import {
	IoClose,
	IoAddOutline,
	IoDocumentTextOutline,
	IoListOutline,
	IoColorPaletteOutline,
} from 'react-icons/io5';
import { useTaskStore } from '../store/taskStore';

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId?: string;
}

const CreateTaskModal = forwardRef<HTMLDivElement, CreateTaskModalProps>(
	(
		{ isOpen, onClose, projectId }: CreateTaskModalProps,
		ref: Ref<HTMLDivElement>
	) => {
		const {
			createTask,
			columns,
			selectedBoard,
			loading,
			labels,
			loadLabels,
			preselectedColumnId,
			setPreselectedColumnId,
		} = useTaskStore();
		const [title, setTitle] = useState('');
		const [description, setDescription] = useState('');
		const [selectedColumnId, setSelectedColumnId] = useState('');
		const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
		const [error, setError] = useState('');

		useEffect(() => {
			if (projectId) {
				loadLabels(projectId);
			}
		}, [loadLabels, projectId]);

		// Устанавливаем предварительно выбранную колонку при открытии модального окна
		useEffect(() => {
			if (preselectedColumnId && isOpen) {
				setSelectedColumnId(preselectedColumnId);
				setPreselectedColumnId(null); // Сбрасываем после использования
			}
		}, [preselectedColumnId, isOpen, setPreselectedColumnId]);

		const handleLabelClick = (labelId: string) => {
			setSelectedLabels(prev =>
				prev.includes(labelId)
					? prev.filter(id => id !== labelId)
					: [...prev, labelId]
			);
		};

		if (!isOpen) return null;

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			if (!title.trim()) {
				setError('Task title cannot be empty');
				return;
			}
			if (!selectedColumnId) {
				setError('Please select a column');
				return;
			}

			setError('');

			if (selectedBoard) {
				try {
					await createTask(
						selectedColumnId,
						title.trim(),
						description.trim() || undefined,
						selectedLabels
					);
					// Reset form
					setTitle('');
					setDescription('');
					setSelectedColumnId('');
					setSelectedLabels([]);
					setError('');
					onClose();
				} catch (error: any) {
					setError(error.response?.data?.message || 'Failed to create task');
				}
			}
		};

		const handleClose = () => {
			setTitle('');
			setDescription('');
			setSelectedColumnId('');
			setSelectedLabels([]);
			setError('');
			onClose();
		};
		return (
			<div
				className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
				onClick={handleClose}
			>
				<div
					ref={ref}
					className='bg-[rgba(10,10,10,0.95)] w-[520px] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden'
					onClick={e => e.stopPropagation()}
				>
					{/* Header */}
					<div className='flex justify-between items-center p-6 pb-4'>
						<div className='flex items-center gap-3'>
							<div className='p-2.5 rounded-xl bg-[rgba(255,152,0,0.15)]'>
								<IoAddOutline className='text-orange-400' size={20} />
							</div>
							<div>
								<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
									Create New Task
								</h2>
								<p className='text-sm text-[rgba(255,255,255,0.6)]'>
									Add a new task to your board
								</p>
							</div>
						</div>
						<button
							onClick={handleClose}
							disabled={loading}
							className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 disabled:opacity-50'
						>
							<IoClose size={20} />
						</button>
					</div>

					{/* Content */}
					<form onSubmit={handleSubmit} className='px-6 pb-6 space-y-4'>
						{/* Task Title */}
						<div>
							<label
								htmlFor='title'
								className='block text-sm font-medium text-[rgba(255,255,255,0.8)] mb-2'
							>
								Task Title *
							</label>
							<div className='relative'>
								<input
									type='text'
									id='title'
									value={title}
									onChange={e => setTitle(e.target.value)}
									placeholder='Enter task title'
									className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 placeholder-[rgba(255,255,255,0.4)]'
									disabled={loading}
									autoFocus
								/>
								<div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400'>
									<IoDocumentTextOutline size={18} />
								</div>
							</div>
						</div>

						{/* Description */}
						<div>
							<label
								htmlFor='description'
								className='block text-sm font-medium text-[rgba(255,255,255,0.8)] mb-2'
							>
								Description
							</label>
							<textarea
								id='description'
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Enter task description (optional)'
								rows={3}
								className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 placeholder-[rgba(255,255,255,0.4)] resize-none'
								disabled={loading}
							/>
						</div>

						{/* Column Selection */}
						<div>
							<label
								htmlFor='column'
								className='block text-sm font-medium text-[rgba(255,255,255,0.8)] mb-2'
							>
								Column *
							</label>
							<div className='relative'>
								<select
									id='column'
									value={selectedColumnId}
									onChange={e => setSelectedColumnId(e.target.value)}
									className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 appearance-none'
									disabled={loading}
								>
									<option value='' className='bg-[#2a2a2a] text-white'>
										Select column
									</option>
									{columns.map(column => (
										<option
											key={column.id}
											value={column.id}
											className='bg-[#2a2a2a] text-white'
										>
											{column.name}
										</option>
									))}
								</select>
								<div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 pointer-events-none'>
									<IoListOutline size={18} />
								</div>
							</div>
						</div>

						{/* Labels */}
						<div>
							<label className='block text-sm font-medium text-[rgba(255,255,255,0.8)] mb-2'>
								<IoColorPaletteOutline className='inline mr-2' size={16} />
								Labels
							</label>
							{labels.length > 0 ? (
								<div className='flex flex-wrap gap-2 p-4 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.05)]'>
									{labels.map(label => (
										<button
											type='button'
											key={label.id}
											onClick={() => handleLabelClick(label.id)}
											className={`
												inline-flex items-center justify-center
												px-3 py-1.5 text-xs font-medium
												rounded-full transition-all duration-200
												min-w-[40px] h-[28px] border-2
												${
													selectedLabels.includes(label.id)
														? 'border-white shadow-lg scale-105 ring-2 ring-orange-400/30'
														: 'border-transparent hover:border-gray-300 hover:scale-102'
												}
											`}
											style={{
												backgroundColor: label.color,
												color: label.color === '#D1FF86' ? '#000' : '#fff',
											}}
											disabled={loading}
										>
											{label.name}
										</button>
									))}
								</div>
							) : (
								<div className='text-[rgba(255,255,255,0.4)] text-sm p-4 bg-[rgba(255,255,255,0.02)] rounded-xl border border-[rgba(255,255,255,0.05)] text-center'>
									No labels available for this project
								</div>
							)}
						</div>

						{/* Error Message */}
						{error && (
							<div className='p-4 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-xl backdrop-blur-sm'>
								<div className='flex items-center gap-2 text-red-400'>
									<IoClose size={16} />
									<span className='font-medium'>{error}</span>
								</div>
							</div>
						)}

						{/* Action buttons */}
						<div className='flex gap-3 pt-2'>
							<button
								type='button'
								onClick={handleClose}
								disabled={loading}
								className='flex-1 px-6 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50'
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={loading || !title.trim() || !selectedColumnId}
								className='flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
							>
								{loading ? (
									<>
										<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
										Creating...
									</>
								) : (
									<>
										<IoAddOutline size={18} />
										Create Task
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
);

export default CreateTaskModal;
