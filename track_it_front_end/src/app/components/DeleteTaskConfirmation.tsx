import { Task } from '../api';
import { IoTrash, IoClose } from 'react-icons/io5';

interface DeleteTaskConfirmationProps {
	isOpen: boolean;
	onClose: () => void;
	task: Task | null;
	onConfirm: (taskId: string) => void;
}

export default function DeleteTaskConfirmation({
	isOpen,
	onClose,
	task,
	onConfirm,
}: DeleteTaskConfirmationProps) {
	if (!isOpen || !task) return null;

	const handleConfirm = () => {
		onConfirm(task.id);
		onClose();
	};
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[450px] rounded-lg shadow-lg overflow-hidden flex flex-col'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex items-center justify-between p-4 border-b border-[#3c3c3e]'>
					<h2 className='text-xl font-semibold flex items-center gap-2'>
						<IoTrash className='text-red-500' />
						Удалить задачу
					</h2>
					<button onClick={onClose}>
						<IoClose size={24} className='text-gray-400 hover:text-white' />
					</button>
				</div>

				<div className='p-6'>
					<p className='mb-6'>
						Вы уверены, что хотите удалить задачу "{task.title}"?
						<br />
						Это действие нельзя отменить.
					</p>

					<div className='flex justify-end gap-3'>
						<button
							onClick={onClose}
							className='px-4 py-2 bg-[#3c3c3e] rounded-md hover:bg-[#4c4c4e]'
						>
							Отмена
						</button>
						<button
							onClick={handleConfirm}
							className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-white'
						>
							Удалить
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
