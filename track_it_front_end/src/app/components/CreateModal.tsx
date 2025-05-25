import { useState } from 'react';
import styles from './Components.module.scss';
import { ProjectService } from '../api/project.service';
import { BoardService } from '../api/board.service';

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
				await ProjectService.create({ name: name.trim() });
			} else if (type === 'board' && selectedProjectId) {
				await BoardService.create(selectedProjectId, { name: name.trim() });
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
		<div className={styles.modalOverlay} onClick={handleClose}>
			<div
				className={styles.modalContent}
				style={{ width: '400px' }}
				onClick={e => e.stopPropagation()}
			>
				{' '}
				<h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
					Create {type === 'project' ? 'Project' : 'Board'}
				</h2>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: '15px' }}>
						{' '}
						<label
							htmlFor='name'
							style={{ display: 'block', marginBottom: '5px' }}
						>
							Name:
						</label>{' '}
						<input
							type='text'
							id='name'
							value={name}
							onChange={e => setName(e.target.value)}
							placeholder={`Enter ${
								type === 'project' ? 'project' : 'board'
							} name`}
							className={styles.input}
							disabled={loading}
						/>
					</div>{' '}
					{error && <div className={styles.error}>{error}</div>}{' '}
					<div className={styles.modalActions}>
						{' '}
						<button
							type='button'
							onClick={handleClose}
							disabled={loading}
							className={styles.cancelButton}
						>
							Cancel
						</button>{' '}
						<button
							type='submit'
							disabled={loading || !name.trim()}
							className={styles.submitButton}
						>
							{loading ? 'Creating...' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
