import { IoClose } from 'react-icons/io5';
import { FiSettings, FiUsers, FiTrash2 } from 'react-icons/fi';
import { Project } from '../api/types';

export default function SettingsModal({
	isOpen,
	onClose,
	selectedProject,
	onOpenProjectSettings,
	onOpenProjectUsers,
	onOpenDeleteProject,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedProject: Project | null;
	onOpenProjectSettings: () => void;
	onOpenProjectUsers: () => void;
	onOpenDeleteProject: () => void;
}) {
	if (!isOpen || !selectedProject) return null;

	return (
		<div
			className='absolute top-11 right-0 bg-[#2c2c2e] w-56 rounded-md shadow-lg border border-[#3c3c3e] z-[2000]'
			onClick={e => e.stopPropagation()}
		>
			<div className='flex justify-between items-center p-3 border-b border-[#3c3c3e]'>
				<h3 className='text-lg font-semibold'>Settings</h3>
				<button onClick={onClose} className='text-gray-400 hover:text-white'>
					<IoClose size={20} />
				</button>
			</div>{' '}
			<div className='p-2'>
				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded transition-colors'
					onClick={() => {
						onOpenProjectSettings();
						onClose(); // Close the settings dropdown
					}}
				>
					<FiSettings className='text-white' />
					<span>Project Settings</span>
				</button>

				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded transition-colors'
					onClick={() => {
						onOpenProjectUsers();
						onClose(); // Close the settings dropdown
					}}
				>
					<FiUsers className='text-white' />
					<span>Project Users</span>
				</button>

				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#ef4444] text-white rounded transition-colors'
					onClick={() => {
						onOpenDeleteProject();
						onClose(); // Close the settings dropdown
					}}
				>
					<FiTrash2 className='text-white' />
					<span>Delete Project</span>
				</button>
			</div>
		</div>
	);
}
