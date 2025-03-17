import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSettings, FiUsers, FiTrash2 } from 'react-icons/fi';
import DeleteProjectModal from './DeleteModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import ProjectUsersModal from './ProjectUsersModal';

export default function SettingsModal({
	isOpen,
	onClose,
	projectsAndBoards,
	selectedProject,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedProject: string;
	projectsAndBoards: Record<string, string[]>;
}) {
	// Track which modal is currently open
	const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
	const [projectUsersOpen, setProjectUsersOpen] = useState(false);
	const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

	if (!isOpen) return null;

	function handleSaveSettings(updatedBoards: string): void {
		throw new Error('Function not implemented.');
	}

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
					onClick={() => setProjectSettingsOpen(true)}
				>
					<FiSettings className='text-white' />
					<span>Project Settings</span>
				</button>

				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded transition-colors'
					onClick={() => setProjectUsersOpen(true)}
				>
					<FiUsers className='text-white' />
					<span>Project Users</span>
				</button>

				<button
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#ef4444] text-white rounded transition-colors'
					onClick={() => setDeleteProjectOpen(true)}
				>
					<FiTrash2 className='text-white' />
					<span>Delete Project</span>
				</button>
			</div>

			{/* Render the appropriate modal based on state */}
			{projectSettingsOpen && (
				<ProjectSettingsModal
					boards={projectsAndBoards[selectedProject]} // Add the boards data
					onSave={updatedBoards => handleSaveSettings(updatedBoards)} // Add a save handler
					isOpen={projectSettingsOpen}
					onClose={() => setProjectSettingsOpen(false)}
					projectName={selectedProject}
				/>
			)}

			{projectUsersOpen && (
				<ProjectUsersModal
					projectName={selectedProject}
					isOpen={projectUsersOpen}
					onClose={() => setProjectUsersOpen(false)}
				/>
			)}

			{deleteProjectOpen && (
				<DeleteProjectModal
					isOpen={deleteProjectOpen}
					onClose={() => setDeleteProjectOpen(false)}
					projectName={selectedProject}
				/>
			)}
		</div>
	);
}
