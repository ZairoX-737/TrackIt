import { useEffect, useRef } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';
import { Task } from '../api/types';

interface TaskMenuPopupProps {
	task: Task;
	position: { x: number; y: number };
	onClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

export default function TaskMenuPopup({
	task,
	position,
	onClose,
	onEdit,
	onDelete,
}: TaskMenuPopupProps) {
	const menuRef = useRef<HTMLDivElement>(null);

	// Close menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose]);
	return (
		<div
			ref={menuRef}
			className='absolute bg-[#2c2c2e] border border-[#3c3c3e] rounded-md shadow-lg z-[1500] w-40'
			style={{
				top: position.y,
				left: position.x,
			}}
		>
			<div className='p-2'>
				<button
					onClick={e => {
						e.stopPropagation();
						onEdit();
					}}
					className='w-full text-left p-2 flex items-center gap-2 hover:bg-[#3c3c3e] rounded-md'
				>
					<FiEdit3 size={16} />
					<span>Редактировать</span>
				</button>
				<button
					onClick={e => {
						e.stopPropagation();
						onDelete();
					}}
					className='w-full text-left p-2 flex items-center gap-2 text-red-400 hover:bg-[#3c3c3e] rounded-md'
				>
					<FiTrash size={16} />
					<span>Удалить</span>
				</button>
			</div>
		</div>
	);
}
