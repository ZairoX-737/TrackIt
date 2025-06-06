import { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface ConfirmDeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	title: string;
	message: string;
	itemName: string;
}

export default function ConfirmDeleteModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	itemName,
}: ConfirmDeleteModalProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	if (!isOpen) return null;

	const handleConfirm = async () => {
		setIsDeleting(true);
		try {
			await onConfirm();
			onClose();
		} catch (error) {
			console.error('Error deleting item:', error);
		} finally {
			setIsDeleting(false);
		}
	};
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]'
			onClick={onClose}
		>
			<div
				className='bg-[#2c2c2e] w-[400px] rounded-lg shadow-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<h2 className='text-lg font-semibold text-red-400'>{title}</h2>
					<button
						onClick={onClose}
						disabled={isDeleting}
						className='text-gray-400 hover:text-white disabled:opacity-50'
					>
						<IoClose size={24} />
					</button>
				</div>

				<div className='p-4'>
					<p className='text-sm mb-2'>
						{message} <strong className='text-white'>{itemName}</strong>?
					</p>{' '}
					<p className='text-xs text-red-400 mb-4'>
						This action cannot be undone.
					</p>
					<div className='flex justify-end gap-3'>
						{' '}
						<button
							onClick={onClose}
							disabled={isDeleting}
							className='px-4 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded-md disabled:opacity-50'
						>
							Cancel
						</button>{' '}
						<button
							onClick={handleConfirm}
							disabled={isDeleting}
							className='px-4 py-2 bg-[#ef4444] hover:bg-red-600 rounded-md disabled:opacity-50'
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
