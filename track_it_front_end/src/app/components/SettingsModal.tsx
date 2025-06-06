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
			className='absolute top-11 right-0 bg-[rgba(10,10,10,0.95)] w-72 rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl z-[2000] overflow-hidden'
			onClick={e => e.stopPropagation()}
		>
			{/* Header */}
			<div className='flex justify-between items-center p-4 pb-3'>
				<h3 className='text-lg font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
					Settings
				</h3>
				<button
					onClick={onClose}
					className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.1)] hover:scale-105'
				>
					<IoClose size={16} />
				</button>
			</div>

			{/* Menu items */}
			<div className='px-3 pb-3'>
				{/* Project Settings */}
				<button
					className='w-full text-left p-3 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.08)] rounded-xl transition-all duration-200 group border border-transparent hover:border-[rgba(255,152,0,0.2)] mb-1'
					onClick={() => {
						onOpenProjectSettings();
						onClose();
					}}
				>
					<div className='p-2.5 bg-[rgba(255,152,0,0.12)] rounded-xl group-hover:bg-[rgba(255,152,0,0.2)] transition-all duration-200 group-hover:scale-105'>
						<FiSettings
							className='text-orange-400 group-hover:text-orange-300'
							size={16}
						/>
					</div>
					<div className='flex flex-col'>
						<span className='text-[rgba(255,255,255,0.9)] group-hover:text-white font-medium text-sm'>
							Project Settings
						</span>
						<span className='text-[rgba(255,255,255,0.5)] text-xs'>
							Configure project details
						</span>
					</div>
				</button>

				{/* Project Users */}
				<button
					className='w-full text-left p-3 flex items-center gap-3 hover:bg-[rgba(255,255,255,0.08)] rounded-xl transition-all duration-200 group border border-transparent hover:border-[rgba(139,92,246,0.2)] mb-1'
					onClick={() => {
						onOpenProjectUsers();
						onClose();
					}}
				>
					<div className='p-2.5 bg-[rgba(139,92,246,0.12)] rounded-xl group-hover:bg-[rgba(139,92,246,0.2)] transition-all duration-200 group-hover:scale-105'>
						<FiUsers
							className='text-purple-400 group-hover:text-purple-300'
							size={16}
						/>
					</div>
					<div className='flex flex-col'>
						<span className='text-[rgba(255,255,255,0.9)] group-hover:text-white font-medium text-sm'>
							Project Users
						</span>
						<span className='text-[rgba(255,255,255,0.5)] text-xs'>
							Manage team members
						</span>
					</div>
				</button>

				{/* Divider */}
				<div className='h-px bg-[rgba(255,255,255,0.1)] my-2'></div>

				{/* Delete Project */}
				<button
					className='w-full text-left p-3 flex items-center gap-3 hover:bg-[rgba(239,68,68,0.1)] rounded-xl transition-all duration-200 group border border-transparent hover:border-[rgba(239,68,68,0.3)]'
					onClick={() => {
						onOpenDeleteProject();
						onClose();
					}}
				>
					<div className='p-2.5 bg-[rgba(239,68,68,0.12)] rounded-xl group-hover:bg-[rgba(239,68,68,0.2)] transition-all duration-200 group-hover:scale-105'>
						<FiTrash2
							className='text-red-400 group-hover:text-red-300'
							size={16}
						/>
					</div>
					<div className='flex flex-col'>
						<span className='text-[rgba(255,255,255,0.9)] group-hover:text-red-300 font-medium text-sm'>
							Delete Project
						</span>
						<span className='text-[rgba(255,255,255,0.5)] group-hover:text-red-400 text-xs'>
							Permanently remove project
						</span>
					</div>
				</button>
			</div>
		</div>
	);
}
