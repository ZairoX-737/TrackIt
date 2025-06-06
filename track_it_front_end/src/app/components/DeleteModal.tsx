import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useTaskStore } from '../store/taskStore';
import { Project } from '../api/types';

export default function DeleteProjectModal({
	isOpen,
	onClose,
	project,
	onProjectDeleted,
}: {
	isOpen: boolean;
	onClose: () => void;
	project: Project;
	onProjectDeleted?: () => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const { deleteProject, projects, selectProject, setModalVisible } =
		useTaskStore();

	if (!isOpen) return null;
	const handleDelete = async () => {
		if (!project) return;

		setIsDeleting(true);
		try {
			// Получаем список проектов до удаления
			const remainingProjects = projects.filter(p => p.id !== project.id);

			// Удаляем проект
			await deleteProject(project.id);

			// После удаления проекта определяем, что делать дальше
			if (remainingProjects.length > 0) {
				// Если есть другие проекты, выбираем первый доступный
				await selectProject(remainingProjects[0]);
			} else {
				// Если проектов не осталось, открываем модальное окно создания/выбора проекта
				setModalVisible(true);
			}

			onClose();
			onProjectDeleted?.();
		} catch (error) {
			console.error('Error deleting project:', error);
		} finally {
			setIsDeleting(false);
		}
	};
	return (
		<div
			className='absolute top-11 right-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border border-[rgba(255,255,255,0.15)] w-80 rounded-2xl shadow-2xl z-[2000] overflow-hidden'
			onClick={e => e.stopPropagation()}
		>
			{/* Header */}
			<div className='flex justify-between items-center p-6 border-b border-[rgba(255,255,255,0.1)]'>
				<div className='flex items-center gap-3'>
					<div className='w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center'>
						<svg
							className='w-4 h-4 text-white'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
							/>
						</svg>
					</div>
					<h3 className='text-lg font-semibold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
						Delete Project
					</h3>
				</div>
				<button
					onClick={onClose}
					className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-all duration-200 text-[rgba(255,255,255,0.7)] hover:text-white'
				>
					<IoClose size={18} />
				</button>
			</div>

			{/* Content */}
			<div className='p-6'>
				<div className='mb-6'>
					<p className='text-[rgba(255,255,255,0.9)] mb-3 leading-relaxed'>
						Are you sure you want to delete{' '}
						<span className='font-semibold text-white bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent'>
							{project.name}
						</span>
						?
					</p>
					<div className='bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-4'>
						<p className='text-sm text-red-300 leading-relaxed'>
							⚠️ This action cannot be undone. All tasks, boards, and data
							within this project will be permanently deleted.
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className='flex gap-3'>
					{' '}
					<button
						className='flex-1 px-4 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] rounded-xl text-sm font-medium transition-all duration-200 text-[rgba(255,255,255,0.8)] hover:text-white'
						onClick={onClose}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button
						className='flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-sm font-medium transition-all duration-200 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? (
							<div className='flex items-center justify-center gap-2'>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
								<span>Deleting...</span>
							</div>
						) : (
							'Delete Project'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
