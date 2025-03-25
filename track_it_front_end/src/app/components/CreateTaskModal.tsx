import React, { forwardRef, Ref, useState } from 'react';
import { BsPlus, BsX } from 'react-icons/bs';
import { useTaskStore } from '../store/taskStore';
import styles from '../components/Components.module.scss';
import taskStyles from '../tasks/Tasks.module.scss';

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const CreateTaskModal = forwardRef<HTMLDivElement, CreateTaskModalProps>(
	({ isOpen, onClose }: CreateTaskModalProps, ref: Ref<HTMLDivElement>) => {
		const { addTask } = useTaskStore();
		const [header, setHeader] = useState('');
		const [description, setDescription] = useState('');
		const [labels, setLabels] = useState<string[]>([]);

		if (!isOpen) return null;

		const handleSubmit = () => {
			if (header.trim()) {
				// Reset form
				setHeader('');
				setDescription('');
				setLabels([]);
				onClose();
			}
		};

		const colorOptions = [
			'#ef4444',
			'#4ade80',
			'#60a5fa',
			'#a855f7',
			'#f97316',
		];

		const handleAddLabel = (color: string) => {
			if (labels.includes(color)) {
				setLabels(labels.filter(label => label !== color));
			} else {
				setLabels([...labels, color]);
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
						<h3 className='text-xl font-bold'>Create New Task</h3>
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
							<label className='block mb-2 font-medium'>Task Title</label>
							<input
								type='text'
								value={header}
								onChange={e => setHeader(e.target.value)}
								placeholder='Enter task title'
								className='w-full bg-[#3c3c3e] p-2 rounded-md border-none focus:outline-[#ff9900]'
								required
							/>
						</div>

						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Description</label>
							<textarea
								value={description}
								onChange={e => setDescription(e.target.value)}
								placeholder='Enter task description (optional)'
								className='w-full bg-[#3c3c3e] p-2 rounded-md border-none focus:outline-[#ff9900] min-h-[100px]'
							/>
						</div>

						<div className='mb-4'>
							<label className='block mb-2 font-medium'>Labels</label>
							<div className='flex gap-2'>
								{colorOptions.map(color => (
									<button
										key={color}
										type='button'
										onClick={() => handleAddLabel(color)}
										className={`
                                        ${taskStyles.label} 
                                        ${
																					labels.includes(color)
																						? 'border-2 border-white'
																						: ''
																				}
                                    `}
										style={{
											backgroundColor: color,
											cursor: 'pointer',
										}}
									/>
								))}
							</div>
						</div>

						<div className='flex justify-end gap-2'>
							<button
								type='button'
								onClick={onClose}
								className='px-4 py-2 bg-[#3c3c3e] rounded-md hover:bg-[#ff9900b1]'
							>
								Cancel
							</button>
							<button
								type='submit'
								className='px-4 py-2 bg-[#ff9900b1] rounded-md hover:bg-[#ff9900]'
							>
								Create Task
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
);

export default CreateTaskModal;
