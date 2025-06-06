import { useState } from 'react';
import { IoClose, IoAddOutline, IoBusiness, IoGrid } from 'react-icons/io5';
import { Project, Board } from '../api/types';

interface ProjectBoardModalProps {
	isOpen: boolean;
	onClose: () => void;
	projects: Project[];
	selectedProject: Project | null;
	onSelect: (project: Project, board: Board) => void;
	onCreateProject?: () => void;
	onCreateBoard?: () => void;
}

export default function ProjectBoardModal({
	isOpen,
	onClose,
	projects,
	selectedProject,
	onSelect,
	onCreateProject,
	onCreateBoard,
}: ProjectBoardModalProps) {
	const [selectedProjectInModal, setSelectedProjectInModal] =
		useState<Project | null>(
			selectedProject || (projects.length > 0 ? projects[0] : null)
		);

	if (!isOpen) return null;
	// Если нет проектов, не показываем модалку
	if (!projects || projects.length === 0) {
		return (
			<div
				className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
				onClick={onClose}
			>
				{' '}
				<div
					className='bg-[rgba(255,255,255,0.05)] w-[400px] rounded-2xl border border-[rgba(255,255,255,0.1)] backdrop-blur-lg shadow-2xl overflow-hidden'
					onClick={e => e.stopPropagation()}
				>
					{/* Header */}
					<div className='p-6 pb-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent'>
								No Projects Available
							</h2>
							<button
								onClick={onClose}
								className='text-[rgba(255,255,255,0.6)] hover:text-white transition-colors p-1 rounded-lg hover:bg-[rgba(255,255,255,0.1)]'
							>
								<IoClose size={20} />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='px-6 pb-6'>
						<p className='text-[rgba(255,255,255,0.7)] mb-4 text-center'>
							You don't have any projects yet. Create your first project to get
							started!
						</p>
						<button
							onClick={onClose}
							className='w-full px-4 py-2.5 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg'
						>
							Get Started
						</button>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
			onClick={onClose}
		>
			<div
				className='bg-[rgba(255,255,255,0.05)] w-[800px] max-h-[600px] rounded-2xl border border-[rgba(255,255,255,0.1)] backdrop-blur-lg shadow-2xl overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='p-6 pb-4'>
					<div className='flex justify-between items-center'>
						<h2 className='text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent'>
							Select Project & Board
						</h2>
						<button
							onClick={onClose}
							className='text-[rgba(255,255,255,0.6)] hover:text-white transition-colors p-1 rounded-lg hover:bg-[rgba(255,255,255,0.1)]'
						>
							<IoClose size={20} />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className='flex h-[480px]'>
					{/* Left column: Projects */}
					<div className='w-1/2 border-r border-[rgba(255,255,255,0.1)] p-6 pt-0'>
						<div className='flex items-center gap-2 mb-4'>
							<IoBusiness className='text-orange-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>Projects</h3>
						</div>

						{/* Projects list */}
						<div className='space-y-2 mb-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar'>
							{projects.map(project => (
								<div
									key={project.id}
									className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
										selectedProjectInModal?.id === project.id
											? 'bg-gradient-to-r from-orange-500/20 to-purple-600/20 border-orange-400/40 text-white'
											: 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white'
									}`}
									onClick={() => setSelectedProjectInModal(project)}
								>
									<div className='font-medium'>{project.name}</div>
									<div className='text-xs text-[rgba(255,255,255,0.6)] mt-1'>
										{project.boards?.length || 0} boards
									</div>
								</div>
							))}
						</div>

						{/* Create project button */}
						<div className='border-t border-[rgba(255,255,255,0.1)] pt-4'>
							<button
								className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200'
								onClick={() => {
									onCreateProject?.();
									onClose();
								}}
							>
								<IoAddOutline size={18} />
								Create Project
							</button>
						</div>
					</div>

					{/* Right column: Boards */}
					<div className='w-1/2 p-6 pt-0'>
						<div className='flex items-center gap-2 mb-4'>
							<IoGrid className='text-purple-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>
								Boards{' '}
								{selectedProjectInModal
									? `for ${selectedProjectInModal.name}`
									: ''}
							</h3>
						</div>

						{/* Boards list */}
						<div className='space-y-2 mb-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar'>
							{selectedProjectInModal?.boards &&
							selectedProjectInModal.boards.length > 0 ? (
								selectedProjectInModal.boards.map(board => (
									<div
										key={board.id}
										className='p-3 rounded-xl cursor-pointer transition-all duration-200 bg-[rgba(255,255,255,0.03)] hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-600/10 border border-[rgba(255,255,255,0.1)] hover:border-orange-400/30 text-[rgba(255,255,255,0.8)] hover:text-white'
										onClick={() => onSelect(selectedProjectInModal, board)}
									>
										<div className='font-medium'>{board.name}</div>
										<div className='text-xs text-[rgba(255,255,255,0.6)] mt-1'>
											{board.columns?.length || 0} columns
										</div>
									</div>
								))
							) : selectedProjectInModal ? (
								<div className='text-center py-8'>
									<IoGrid
										className='mx-auto text-[rgba(255,255,255,0.3)] mb-3'
										size={48}
									/>
									<p className='text-[rgba(255,255,255,0.6)]'>
										No boards available
									</p>
									<p className='text-xs text-[rgba(255,255,255,0.4)] mt-1'>
										Create your first board to get started
									</p>
								</div>
							) : (
								<div className='text-center py-8'>
									<IoBusiness
										className='mx-auto text-[rgba(255,255,255,0.3)] mb-3'
										size={48}
									/>
									<p className='text-[rgba(255,255,255,0.6)]'>
										Select a project first
									</p>
								</div>
							)}
						</div>

						{/* Create board button */}
						<div className='border-t border-[rgba(255,255,255,0.1)] pt-4'>
							<button
								className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
									selectedProjectInModal
										? 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white shadow-lg'
										: 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] cursor-not-allowed'
								}`}
								onClick={() => {
									if (selectedProjectInModal) {
										onCreateBoard?.();
										onClose();
									}
								}}
								disabled={!selectedProjectInModal}
							>
								<IoAddOutline size={18} />
								Create Board
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Custom scrollbar styles */}
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background: rgba(255, 255, 255, 0.05);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(255, 255, 255, 0.2);
					border-radius: 3px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgba(255, 255, 255, 0.3);
				}
			`}</style>
		</div>
	);
}
