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
			className='absolute top-11 right-0 bg-[#2c2c2e] w-72 rounded-md shadow-lg border border-[#3c3c3e] z-[2000]'
			onClick={e => e.stopPropagation()}
		>
			<div className='flex justify-between items-center p-3 border-b border-[#3c3c3e]'>
				<h3 className='text-lg font-semibold'>Delete Project</h3>
				<button onClick={onClose} className='text-gray-400 hover:text-white'>
					<IoClose size={20} />
				</button>
			</div>

			<div className='p-4'>
				{' '}
				<div className='mb-4'>
					<p className='text-sm mb-2'>
						Are you sure you want to delete <strong>{project.name}</strong>?
					</p>
					<p className='text-xs text-red-400 mb-3'>
						This action cannot be undone. All tasks and boards within this
						project will be permanently deleted.
					</p>
				</div>
				<div className='flex justify-between gap-3'>
					<button
						className='flex-1 px-3 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded text-sm'
						onClick={onClose}
						disabled={isDeleting}
					>
						Cancel
					</button>
					<button
						className='flex-1 px-3 py-2 bg-[#ef4444] hover:bg-red-600 rounded text-sm'
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete Project'}
					</button>
				</div>
			</div>
		</div>
	);
}
