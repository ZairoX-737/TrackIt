import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiSettings, FiUsers, FiTrash2 } from 'react-icons/fi';
import DeleteProjectModal from './DeleteModal';
import ProjectSettingsModal from './ProjectSettingsModal';
import ProjectUsersModal from './ProjectUsersModal';
import { Project } from '../api/types';

export default function SettingsModal({
	isOpen,
	onClose,
	selectedProject,
}: {
	isOpen: boolean;
	onClose: () => void;
	selectedProject: Project | null;
}) {
	// Track which modal is currently open
	const [projectSettingsOpen, setProjectSettingsOpen] = useState(false);
	const [projectUsersOpen, setProjectUsersOpen] = useState(false);
	const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);

	if (!isOpen || !selectedProject) return null;

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
					project={selectedProject}
					isOpen={projectSettingsOpen}
					onClose={() => setProjectSettingsOpen(false)}
				/>
			)}{' '}
			{projectUsersOpen && (
				<ProjectUsersModal
					projectId={selectedProject.id}
					projectName={selectedProject.name}
					isOpen={projectUsersOpen}
					onClose={() => setProjectUsersOpen(false)}
				/>
			)}{' '}
			{deleteProjectOpen && (
				<DeleteProjectModal
					isOpen={deleteProjectOpen}
					onClose={() => setDeleteProjectOpen(false)}
					project={selectedProject}
					onProjectDeleted={() => {
						setDeleteProjectOpen(false);
						onClose(); // Закрываем настройки после удаления проекта
					}}
				/>
			)}
		</div>
	);
}
