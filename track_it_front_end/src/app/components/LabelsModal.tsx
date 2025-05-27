import { useState, useEffect } from 'react';
import { IoClose, IoTrash, IoAdd } from 'react-icons/io5';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { Label } from '../api/types';
import { LabelService } from '../api';

interface LabelsModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
	projectName: string;
}

interface LabelChange {
	id: string;
	originalName: string;
	originalColor: string;
	newName: string;
	newColor: string;
	isDeleted: boolean;
	isNew?: boolean;
}

export default function LabelsModal({
	isOpen,
	onClose,
	projectId,
	projectName,
}: LabelsModalProps) {
	const [labels, setLabels] = useState<Label[]>([]);
	const [labelChanges, setLabelChanges] = useState<Record<string, LabelChange>>(
		{}
	);
	const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newLabelName, setNewLabelName] = useState('');
	const [newLabelColor, setNewLabelColor] = useState('#6B7280');

	// Предустановленные цвета для быстрого выбора
	const predefinedColors = [
		'#6B7280', // gray
		'#3B82F6', // blue
		'#EF4444', // red
		'#10B981', // green
		'#F59E0B', // amber
		'#8B5CF6', // purple
		'#EC4899', // pink
		'#F97316', // orange
		'#06B6D4', // cyan
		'#84CC16', // lime
	];

	// Загрузка лейблов при открытии модали
	useEffect(() => {
		if (isOpen && projectId) {
			loadLabels();
		}
	}, [isOpen, projectId]);

	const loadLabels = async () => {
		try {
			setLoading(true);
			setError(null);
			const projectLabels = await LabelService.getByProject(projectId);
			setLabels(projectLabels);
			setLabelChanges({});
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to load labels');
		} finally {
			setLoading(false);
		}
	};

	// Получить отображаемое имя лейбла
	const getLabelDisplayName = (label: Label): string => {
		const change = labelChanges[label.id];
		return change ? change.newName : label.name;
	};

	// Получить отображаемый цвет лейбла
	const getLabelDisplayColor = (label: Label): string => {
		const change = labelChanges[label.id];
		return change ? change.newColor : label.color;
	};

	// Проверить, удален ли лейбл локально
	const isLabelDeleted = (label: Label): boolean => {
		const change = labelChanges[label.id];
		return change ? change.isDeleted : false;
	};

	// Обработчик клика по названию лейбла для редактирования
	const handleLabelNameClick = (labelId: string) => {
		setEditingLabelId(labelId);
	};

	// Обработчик изменения названия лейбла
	const handleLabelNameChange = (labelId: string, newName: string) => {
		const label = labels.find(l => l.id === labelId);
		if (!label) return;

		setLabelChanges(prev => ({
			...prev,
			[labelId]: {
				id: labelId,
				originalName: label.name,
				originalColor: label.color,
				newName: newName,
				newColor: prev[labelId]?.newColor || label.color,
				isDeleted: prev[labelId]?.isDeleted || false,
			},
		}));
	};

	// Обработчик изменения цвета лейбла
	const handleLabelColorChange = (labelId: string, newColor: string) => {
		const label = labels.find(l => l.id === labelId);
		if (!label) return;

		setLabelChanges(prev => ({
			...prev,
			[labelId]: {
				id: labelId,
				originalName: label.name,
				originalColor: label.color,
				newName: prev[labelId]?.newName || label.name,
				newColor: newColor,
				isDeleted: prev[labelId]?.isDeleted || false,
			},
		}));
	};

	// Обработчик нажатия клавиш при редактировании
	const handleLabelNameKeyDown = (e: React.KeyboardEvent, labelId: string) => {
		if (e.key === 'Enter') {
			setEditingLabelId(null);
		} else if (e.key === 'Escape') {
			// Отменяем изменения для этого лейбла
			setLabelChanges(prev => {
				const newChanges = { ...prev };
				if (newChanges[labelId]) {
					const label = labels.find(l => l.id === labelId);
					if (label) {
						newChanges[labelId].newName = label.name;
					}
				}
				return newChanges;
			});
			setEditingLabelId(null);
		}
	};

	// Обработчик удаления лейбла (локальное)
	const handleDeleteLabel = (labelId: string) => {
		const label = labels.find(l => l.id === labelId);
		if (!label) return;

		setLabelChanges(prev => ({
			...prev,
			[labelId]: {
				id: labelId,
				originalName: label.name,
				originalColor: label.color,
				newName: prev[labelId]?.newName || label.name,
				newColor: prev[labelId]?.newColor || label.color,
				isDeleted: true,
			},
		}));
	};

	// Обработчик восстановления лейбла
	const handleRestoreLabel = (labelId: string) => {
		setLabelChanges(prev => {
			const newChanges = { ...prev };
			if (newChanges[labelId]) {
				newChanges[labelId].isDeleted = false;
				// Если нет других изменений, удаляем запись
				const label = labels.find(l => l.id === labelId);
				if (
					label &&
					newChanges[labelId].newName === label.name &&
					newChanges[labelId].newColor === label.color
				) {
					delete newChanges[labelId];
				}
			}
			return newChanges;
		});
	};

	// Обработчик создания нового лейбла
	const handleCreateLabel = () => {
		setIsCreatingNew(true);
		setNewLabelName('');
		setNewLabelColor('#6B7280');
	};

	// Обработчик сохранения нового лейбла
	const handleSaveNewLabel = async () => {
		if (!newLabelName.trim()) return;

		try {
			const newLabel = await LabelService.create({
				name: newLabelName.trim(),
				color: newLabelColor,
				projectId: projectId,
			});
			setLabels(prev => [...prev, newLabel]);
			setIsCreatingNew(false);
			setNewLabelName('');
			setNewLabelColor('#6B7280');
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to create label');
		}
	};

	// Обработчик отмены создания нового лейбла
	const handleCancelNewLabel = () => {
		setIsCreatingNew(false);
		setNewLabelName('');
		setNewLabelColor('#6B7280');
	};

	// Проверка наличия изменений
	const hasChanges = (): boolean => {
		return Object.keys(labelChanges).length > 0;
	};

	// Применение всех изменений
	const handleSaveChanges = async () => {
		try {
			setLoading(true);
			setError(null);

			// Применяем изменения лейблов
			for (const change of Object.values(labelChanges)) {
				if (change.isDeleted) {
					// Удаляем лейбл
					await LabelService.delete(change.id);
				} else if (
					change.newName !== change.originalName ||
					change.newColor !== change.originalColor
				) {
					// Обновляем лейбл
					await LabelService.update(change.id, {
						name: change.newName.trim(),
						color: change.newColor,
					});
				}
			}

			// Перезагружаем лейблы
			await loadLabels();
			onClose();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Failed to save changes');
		} finally {
			setLoading(false);
		}
	};

	// Обработчик отмены (сбрасываем все изменения)
	const handleCancel = () => {
		setLabelChanges({});
		setEditingLabelId(null);
		setIsCreatingNew(false);
		setNewLabelName('');
		setNewLabelColor('#6B7280');
		setError(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
			onClick={handleCancel}
		>
			<div
				className='bg-[#2c2c2e] w-[600px] max-h-[80vh] rounded-lg shadow-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-4 border-b border-[#3c3c3e]'>
					<div>
						<h2 className='text-xl font-semibold'>Project Labels</h2>
						<p className='text-sm text-gray-400'>{projectName}</p>
					</div>
					<button onClick={handleCancel} disabled={loading}>
						<IoClose size={24} className='text-gray-400 hover:text-white' />
					</button>
				</div>

				{/* Content */}
				<div className='p-4 overflow-y-auto max-h-[calc(80vh-140px)]'>
					{error && (
						<div className='mb-4 p-3 bg-red-600 text-white rounded-md'>
							{error}
						</div>
					)}

					{/* Create New Label Button */}
					<div className='mb-4'>
						<button
							onClick={handleCreateLabel}
							disabled={loading || isCreatingNew}
							className='flex items-center gap-2 px-3 py-2 bg-[#ff9800] hover:bg-[#f57c00] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md'
						>
							<IoAdd size={18} />
							Add New Label
						</button>
					</div>

					{/* New Label Form */}
					{isCreatingNew && (
						<div className='mb-4 p-4 bg-[#3c3c3e] rounded-lg'>
							<h4 className='text-md font-medium mb-3'>Create New Label</h4>
							<div className='space-y-3'>
								<div>
									<label className='block text-sm font-medium mb-1'>Name</label>
									<input
										type='text'
										value={newLabelName}
										onChange={e => setNewLabelName(e.target.value)}
										placeholder='Enter label name'
										className='w-full bg-[#252528] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff9800]'
										autoFocus
									/>
								</div>
								<div>
									<label className='block text-sm font-medium mb-1'>
										Color
									</label>
									<div className='flex gap-2 mb-2'>
										{predefinedColors.map(color => (
											<button
												key={color}
												onClick={() => setNewLabelColor(color)}
												className={`w-8 h-8 rounded-full border-2 ${
													newLabelColor === color
														? 'border-white'
														: 'border-transparent'
												}`}
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
									<input
										type='color'
										value={newLabelColor}
										onChange={e => setNewLabelColor(e.target.value)}
										className='w-16 h-8 rounded border border-gray-500'
									/>
								</div>
								<div className='flex gap-2'>
									<button
										onClick={handleSaveNewLabel}
										disabled={!newLabelName.trim()}
										className='px-3 py-1 bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-600 text-white rounded text-sm'
									>
										<FiSave size={14} className='inline mr-1' />
										Save
									</button>
									<button
										onClick={handleCancelNewLabel}
										className='px-3 py-1 bg-[#3c3c3e] hover:bg-[#4c4c4e] text-white rounded text-sm'
									>
										<FiX size={14} className='inline mr-1' />
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Labels List */}
					<div className='space-y-2'>
						{loading && labels.length === 0 ? (
							<div className='text-center py-4'>Loading labels...</div>
						) : labels.length > 0 ? (
							labels.map(label => {
								const isDeleted = isLabelDeleted(label);
								const displayName = getLabelDisplayName(label);
								const displayColor = getLabelDisplayColor(label);

								return (
									<div
										key={label.id}
										className={`flex items-center justify-between p-3 rounded-md ${
											isDeleted
												? 'bg-red-900/20 border border-red-500/30'
												: 'bg-[#3c3c3e]'
										}`}
									>
										{/* Label Info */}
										<div className='flex items-center gap-3 flex-1'>
											{/* Color Preview */}
											<div className='flex gap-2'>
												{predefinedColors.map(color => (
													<button
														key={color}
														onClick={() =>
															handleLabelColorChange(label.id, color)
														}
														className={`w-6 h-6 rounded-full border ${
															displayColor === color
																? 'border-white border-2'
																: 'border-gray-500'
														}`}
														style={{ backgroundColor: color }}
														disabled={isDeleted}
													/>
												))}
												<input
													type='color'
													value={displayColor}
													onChange={e =>
														handleLabelColorChange(label.id, e.target.value)
													}
													className='w-6 h-6 rounded border border-gray-500'
													disabled={isDeleted}
												/>
											</div>

											{/* Label Name */}
											<div className='flex-1'>
												{editingLabelId === label.id ? (
													<input
														type='text'
														value={displayName}
														onChange={e =>
															handleLabelNameChange(label.id, e.target.value)
														}
														onBlur={() => setEditingLabelId(null)}
														onKeyDown={e => handleLabelNameKeyDown(e, label.id)}
														autoFocus
														className='bg-[#4c4c4e] text-white px-2 py-1 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#ff9800]'
													/>
												) : (
													<div
														onClick={() =>
															!isDeleted && handleLabelNameClick(label.id)
														}
														className={`px-2 py-1 rounded cursor-pointer transition-colors ${
															isDeleted
																? 'text-red-400 line-through cursor-not-allowed'
																: 'hover:bg-[#4c4c4e]'
														}`}
													>
														<span
															className='inline-block px-2 py-1 rounded text-white text-sm'
															style={{ backgroundColor: displayColor }}
														>
															{displayName}
														</span>
														{isDeleted && (
															<span className='ml-2 text-xs'>
																(will be deleted)
															</span>
														)}
													</div>
												)}
											</div>
										</div>

										{/* Actions */}
										<div className='flex items-center gap-1'>
											{isDeleted ? (
												<button
													onClick={() => handleRestoreLabel(label.id)}
													className='text-green-400 hover:text-green-300 p-1'
													title='Restore label'
												>
													<FiEdit2 size={16} />
												</button>
											) : (
												<button
													onClick={() => handleDeleteLabel(label.id)}
													className='text-gray-400 hover:text-red-500 p-1'
													title='Delete label'
												>
													<IoTrash size={16} />
												</button>
											)}
										</div>
									</div>
								);
							})
						) : (
							<div className='text-gray-400 text-center py-4'>
								No labels in this project yet
							</div>
						)}
					</div>

					<p className='text-xs text-gray-400 mt-4'>
						Click on label name to edit. Select colors from the palette or use
						the color picker.
					</p>
				</div>

				{/* Footer */}
				<div className='flex justify-end gap-3 p-4 border-t border-[#3c3c3e]'>
					<button
						onClick={handleCancel}
						disabled={loading}
						className='px-4 py-2 bg-[#3c3c3e] hover:bg-[#4c4c4e] rounded-md disabled:opacity-50'
					>
						Cancel
					</button>
					<button
						onClick={handleSaveChanges}
						disabled={loading || !hasChanges()}
						className={`px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 ${
							hasChanges()
								? 'bg-[#ff9800] hover:bg-[#f57c00] text-white'
								: 'bg-[#3c3c3e] text-gray-400'
						}`}
					>
						<FiSave size={18} />
						{loading ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	);
}
