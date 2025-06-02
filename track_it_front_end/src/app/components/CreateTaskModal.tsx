import React, { forwardRef, Ref, useEffect, useState } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';
import { useTaskStore } from '../store/taskStore';
import styles from '../components/Components.module.scss';

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
		const handleSubmit = async () => {
			if (title.trim() && selectedColumnId && selectedBoard) {
				try {
					await createTask(
						selectedColumnId,
						title,
						description || undefined,
						selectedLabels
					);
					// Reset form
					setTitle('');
					setDescription('');
					setSelectedColumnId('');
					setSelectedLabels([]);
					onClose();
				} catch (error) {
					console.error('Error creating task:', error);
				}
			}
		};

		return (
			<div
				className={styles.modalOverlay}
				onMouseDown={e => {
					if (e.target === e.currentTarget) {
						onClose();
					}
				}}
			>
				<div className={styles.modalContent} style={{ width: '500px' }}>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-xl font-bold p-1'>Create new task</h3>
						<button
							onClick={onClose}
							className='hover:bg-gray-700 rounded-full p-1'
						>
							<BsX size={24} />
						</button>
					</div>

					<form
						onSubmit={e => {
							e.preventDefault();
							handleSubmit();
						}}
					>
						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Task title</label>
							<input
								type='text'
								value={title}
								onChange={e => setTitle(e.target.value)}
								placeholder='Enter task title'
								className='w-full bg-[#3c3c3e] p-2 rounded-md border-none focus:outline-[#ff9900]'
								required
								disabled={loading}
							/>
						</div>

						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Description</label>
							<textarea
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Enter task description (optional)'
								className='w-full bg-[#3c3c3e] p-2 rounded-md border-none focus:outline-[#ff9900] min-h-[100px]'
								disabled={loading}
							/>
						</div>

						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Column</label>
							<select
								value={selectedColumnId}
								onChange={e => setSelectedColumnId(e.target.value)}
								className='w-full bg-[#3c3c3e] p-2 rounded-md border-none focus:outline-[#ff9900]'
								required
								disabled={loading}
							>
								<option value=''>Select column</option>
								{columns.map(column => (
									<option key={column.id} value={column.id}>
										{column.name}
									</option>
								))}
							</select>
						</div>

						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Labels</label>
							{labels.length > 0 ? (
								<div className='flex flex-wrap gap-2'>
									{labels.map(label => (
										<button
											type='button'
											key={label.id}
											onClick={() => handleLabelClick(label.id)}
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
											disabled={loading}
										>
											{label.name}
										</button>
									))}
								</div>
							) : (
								<div className='text-gray-400 text-xs'>No labels available</div>
							)}
						</div>

						<div className='flex justify-end gap-2'>
							<button
								type='button'
								onClick={onClose}
								className='px-4 py-2 bg-[#3c3c3e] rounded-md hover:bg-[#ff9900b1]'
								disabled={loading}
							>
								Cancel
							</button>
							<button
								type='submit'
								className='px-4 py-2 bg-[#ff9900b1] rounded-md hover:bg-[#ff9900] disabled:opacity-50'
								disabled={loading || !title.trim() || !selectedColumnId}
							>
								{loading ? 'Creating...' : 'Create task'}
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
);

export default CreateTaskModal;
