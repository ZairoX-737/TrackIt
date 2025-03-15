import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSettings, FiUsers, FiTrash2 } from 'react-icons/fi';

export default function SettingsModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

	if (!isOpen) return null;

	return (
		<div
			className='absolute top-11 right-0 bg-[#2c2c2e] w-56 rounded-md shadow-lg border border-[#3c3c3e] z-50'
			onClick={e => e.stopPropagation()}
		>
			<div className='flex justify-between items-center p-3 border-b border-[#3c3c3e]'>
				<h3 className='text-lg font-semibold'>Settings</h3>
				<button onClick={onClose} className='text-gray-400 hover:text-white'>
					<IoClose size={20} />
				</button>
			</div>

			<div className='p-2'>
				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded transition-colors'
					onClick={() => console.log('Project Settings')}
				>
					<FiSettings className='text-white' />
					<span>Project Settings</span>
				</button>

				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded transition-colors'
					onClick={() => console.log('Project Users')}
				>
					<FiUsers className='text-white' />
					<span>Project Users</span>
				</button>

				{!showConfirmDelete ? (
					<button
						className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#ef4444] text-white rounded transition-colors'
						onClick={() => setShowConfirmDelete(true)}
					>
						<FiTrash2 className='text-white' />
						<span>Delete Project</span>
					</button>
				) : (
					<div className='p-2 border border-[#ef4444] bg-[#3c3c3e] rounded mt-2'>
						<p className='text-sm mb-2'>
							Are you sure you want to delete this project?
						</p>
						<div className='flex justify-between'>
							<button
								className='px-3 py-1 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded'
								onClick={() => setShowConfirmDelete(false)}
							>
								Cancel
							</button>
							<button
								className='px-3 py-1 bg-[#ef4444] hover:bg-red-600 rounded'
								onClick={() => console.log('Delete Project')}
							>
								Delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
