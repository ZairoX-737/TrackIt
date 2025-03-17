import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiEdit2, FiSave } from 'react-icons/fi';

interface ProjectSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectName: string;
	boards: string[];
	onSave: (newProjectName: string, newBoards: string[]) => void;
}

export default function ProjectSettingsModal({
	isOpen,
	onClose,
	projectName,
	boards,
	onSave,
}: ProjectSettingsModalProps) {
	const [editedProjectName, setEditedProjectName] = useState(projectName);
	const [editedBoards, setEditedBoards] = useState<string[]>([...boards]);
	const [editingBoardIndex, setEditingBoardIndex] = useState<number | null>(
		null
	);

	useEffect(() => {
		setEditedProjectName(projectName);
		setEditedBoards([...boards]);
	}, [isOpen, projectName, boards]);

	if (!isOpen) return null;

	const handleSave = () => {
		onSave(editedProjectName, editedBoards);
		onClose();
	};

	const updateBoardName = (index: number, newName: string) => {
		const newBoards = [...editedBoards];
		newBoards[index] = newName;
		setEditedBoards(newBoards);
	};

	const addNewBoard = () => {
		setEditedBoards([...editedBoards, `New Board ${editedBoards.length + 1}`]);
		setEditingBoardIndex(editedBoards.length);
	};

	const removeBoard = (index: number) => {
		const newBoards = [...editedBoards];
		newBoards.splice(index, 1);
		setEditedBoards(newBoards);
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[500px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<h2 className='text-xl font-semibold'>Project Settings</h2>
					<button onClick={onClose}>
						<IoClose size={24} className='text-gray-400 hover:text-white' />
					</button>
				</div>

				<div className='p-4 overflow-y-auto max-h-[calc(80vh-120px)]'>
					{/* Project Name */}
					<div className='mb-6'>
						<h3 className='text-lg font-medium mb-2'>Project Name</h3>
						<div className='flex items-center'>
							<input
								type='text'
								value={editedProjectName}
								onChange={e => setEditedProjectName(e.target.value)}
								className='bg-[#3c3c3e] text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
							/>
						</div>
					</div>

					{/* Boards */}
					<div className='mb-6'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-lg font-medium'>Boards</h3>
							<button
								onClick={addNewBoard}
								className='bg-[#3c3c3e] hover:bg-[#4c4c4e] text-white px-3 py-1 rounded-md text-sm'
							>
								Add Board
							</button>
						</div>
						<ul className='space-y-2'>
							{editedBoards.map((board, index) => (
								<li
									key={index}
									className='flex items-center justify-between bg-[#3c3c3e] p-2 rounded-md'
								>
									{editingBoardIndex === index ? (
										<input
											type='text'
											value={board}
											onChange={e => updateBoardName(index, e.target.value)}
											autoFocus
											onBlur={() => setEditingBoardIndex(null)}
											onKeyDown={e =>
												e.key === 'Enter' && setEditingBoardIndex(null)
											}
											className='bg-[#4c4c4e] text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ff9800]'
										/>
									) : (
										<span>{board}</span>
									)}
									<div className='flex gap-2'>
										<button
											onClick={() => setEditingBoardIndex(index)}
											className='text-gray-400 hover:text-white'
										>
											<FiEdit2 size={18} />
										</button>
										<button
											onClick={() => removeBoard(index)}
											className='text-gray-400 hover:text-red-500'
										>
											<IoClose size={18} />
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className='flex justify-end gap-3 p-4 border-t border-[#3c3c3e]'>
					<button
						onClick={onClose}
						className='px-4 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded-md'
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='px-4 py-2 bg-[#ff9800] hover:bg-[#f57c00] rounded-md flex items-center gap-2'
					>
						<FiSave size={18} />
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}
