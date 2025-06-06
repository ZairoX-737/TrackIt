import { useState } from 'react';
import { IoClose, IoAddOutline, IoBusiness, IoGrid } from 'react-icons/io5';
import { useTaskStore } from '../store/taskStore';

interface CreateModalProps {
	isOpen: boolean;
	onClose: () => void;
	type: 'project' | 'board';
	selectedProjectId?: string; // Required for board creation
	onSuccess?: () => void; // Callback после успешного создания
}

export default function CreateModal({
	isOpen,
	onClose,
	type,
	selectedProjectId,
	onSuccess,
}: CreateModalProps) {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { createProject, createBoard } = useTaskStore();

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) {
			setError('Name cannot be empty');
			return;
		}

		setLoading(true);
		setError('');
		try {
			if (type === 'project') {
				await createProject(name.trim());
			} else if (type === 'board' && selectedProjectId) {
				await createBoard(selectedProjectId, name.trim());
			}

			setName('');
			onSuccess?.();
			onClose();
		} catch (err: any) {
			setError(
				err.response?.data?.message || 'An error occurred while creating'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setName('');
		setError('');
		onClose();
	};
	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
			onClick={handleClose}
		>
			<div
				className='bg-[rgba(10,10,10,0.95)] w-[480px] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-6 pb-4'>
					<div className='flex items-center gap-3'>
						<div
							className={`p-2.5 rounded-xl ${
								type === 'project'
									? 'bg-[rgba(255,152,0,0.15)]'
									: 'bg-[rgba(139,92,246,0.15)]'
							}`}
						>
							{type === 'project' ? (
								<IoBusiness className='text-orange-400' size={20} />
							) : (
								<IoGrid className='text-purple-400' size={20} />
							)}
						</div>
						<div>
							<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
								Create {type === 'project' ? 'Project' : 'Board'}
							</h2>
							<p className='text-sm text-[rgba(255,255,255,0.6)]'>
								{type === 'project'
									? 'Start a new project to organize your work'
									: 'Add a new board to your project'}
							</p>
						</div>
					</div>
					<button
						onClick={handleClose}
						disabled={loading}
						className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 disabled:opacity-50'
					>
						<IoClose size={20} />
					</button>
				</div>

				{/* Content */}
				<form onSubmit={handleSubmit} className='px-6 pb-6'>
					<div className='mb-6'>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-[rgba(255,255,255,0.8)] mb-2'
						>
							{type === 'project' ? 'Project' : 'Board'} Name
						</label>
						<div className='relative'>
							<input
								type='text'
								id='name'
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder={`Enter ${
									type === 'project' ? 'project' : 'board'
								} name`}
								className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200 placeholder-[rgba(255,255,255,0.4)]'
								disabled={loading}
								autoFocus
							/>
							<div
								className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
									type === 'project' ? 'text-orange-400' : 'text-purple-400'
								}`}
							>
								{type === 'project' ? (
									<IoBusiness size={18} />
								) : (
									<IoGrid size={18} />
								)}
							</div>
						</div>
					</div>

					{/* Error Message */}
					{error && (
						<div className='mb-6 p-4 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-xl backdrop-blur-sm'>
							<div className='flex items-center gap-2 text-red-400'>
								<IoClose size={16} />
								<span className='font-medium'>{error}</span>
							</div>
						</div>
					)}

					{/* Action buttons */}
					<div className='flex gap-3'>
						<button
							type='button'
							onClick={handleClose}
							disabled={loading}
							className='flex-1 px-6 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50'
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading || !name.trim()}
							className={`flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${
								type === 'project'
									? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
									: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
							}`}
						>
							{loading ? (
								<>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									Creating...
								</>
							) : (
								<>
									<IoAddOutline size={18} />
									Create {type === 'project' ? 'Project' : 'Board'}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
