import { useState, useEffect } from 'react';
import {
	IoClose,
	IoTrash,
	IoAdd,
	IoColorPaletteOutline,
	IoSaveOutline,
	IoRefreshOutline,
} from 'react-icons/io5';
import { Label } from '../api/types';
import { LabelService } from '../api';
import { useTaskStore } from '../store/taskStore';

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
	const { labels, createLabel, updateLabel, deleteLabel, loadLabels } =
		useTaskStore();
	const [localLabels, setLocalLabels] = useState<Label[]>([]);
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
	// Синхронизация локального состояния с глобальным store при открытии модали
	useEffect(() => {
		if (isOpen && projectId) {
			// Загружаем лейблы в глобальный store
			loadLabels(projectId);
			setLabelChanges({});
		}
	}, [isOpen, projectId, loadLabels]);

	// Синхронизируем локальные лейблы с глобальными
	useEffect(() => {
		setLocalLabels(labels);
	}, [labels]);
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
		const label = localLabels.find(l => l.id === labelId);
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
		const label = localLabels.find(l => l.id === labelId);
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
					const label = localLabels.find(l => l.id === labelId);
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
		const label = localLabels.find(l => l.id === labelId);
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
				const label = localLabels.find(l => l.id === labelId);
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
			// Используем глобальный store для создания лейбла
			await createLabel(newLabelName.trim(), newLabelColor, projectId);
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

			// Применяем изменения лейблов через глобальный store
			for (const change of Object.values(labelChanges)) {
				if (change.isDeleted) {
					// Удаляем лейбл
					await deleteLabel(change.id);
				} else if (
					change.newName !== change.originalName ||
					change.newColor !== change.originalColor
				) {
					// Обновляем лейбл
					await updateLabel(change.id, change.newName, change.newColor);
				}
			}

			// Сбрасываем локальные изменения
			setLabelChanges({});
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
			className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[2000]'
			onClick={handleCancel}
		>
			<div
				className='bg-[rgba(10,10,10,0.95)] w-[700px] max-h-[85vh] rounded-2xl border border-[rgba(255,255,255,0.15)] backdrop-blur-xl shadow-2xl overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex justify-between items-center p-6 pb-4'>
					<div className='flex items-center gap-3'>
						<div className='p-2.5 rounded-xl bg-[rgba(255,152,0,0.15)]'>
							<IoColorPaletteOutline className='text-orange-400' size={20} />
						</div>
						<div>
							<h2 className='text-xl font-bold bg-gradient-to-r from-white to-[rgba(255,255,255,0.8)] bg-clip-text text-transparent'>
								Project Labels
							</h2>
							<p className='text-sm text-[rgba(255,255,255,0.6)]'>
								{projectName}
							</p>
						</div>
					</div>
					<button
						onClick={handleCancel}
						disabled={loading}
						className='text-[rgba(255,255,255,0.5)] hover:text-white transition-all duration-200 p-2 rounded-xl hover:bg-[rgba(255,255,255,0.1)] hover:scale-105 disabled:opacity-50'
					>
						<IoClose size={20} />
					</button>
				</div>{' '}
				{/* Content */}
				<div
					className='px-6 pb-6 overflow-y-auto max-h-[calc(85vh-160px)] space-y-4'
					style={{
						scrollbarWidth: 'thin',
						scrollbarColor: 'rgba(255,255,255,0.3) transparent',
					}}
				>
					{error && (
						<div className='p-4 bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-xl'>
							<p className='text-red-400 text-sm'>{error}</p>
						</div>
					)}
					{/* Create New Label Section */}
					<div className='bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-[rgba(255,255,255,0.08)]'>
						<div className='flex items-center justify-between mb-4'>
							<h3 className='text-lg font-semibold text-white flex items-center gap-2'>
								<IoAdd className='text-orange-400' size={18} />
								Add New Label
							</h3>
							{!isCreatingNew && (
								<button
									onClick={handleCreateLabel}
									disabled={loading}
									className='px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg disabled:opacity-50'
								>
									<IoAdd size={16} />
									New Label
								</button>
							)}
						</div>{' '}
						{/* New Label Form */}
						{isCreatingNew && (
							<div className='mt-4 p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl'>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-white mb-2'>
											Label Name
										</label>
										<input
											type='text'
											value={newLabelName}
											onChange={e => setNewLabelName(e.target.value)}
											placeholder='Enter label name'
											className='w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-[rgba(255,255,255,0.08)] transition-all duration-200'
											autoFocus
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-white mb-2'>
											Label Color
										</label>
										<div className='flex flex-wrap gap-2 mb-3'>
											{predefinedColors.map(color => (
												<button
													key={color}
													onClick={() => setNewLabelColor(color)}
													className={`w-8 h-8 rounded-xl transition-all duration-200 hover:scale-110 ${
														newLabelColor === color
															? 'ring-2 ring-white ring-offset-2 ring-offset-[rgba(10,10,10,0.95)] shadow-lg'
															: 'hover:ring-1 hover:ring-[rgba(255,255,255,0.3)]'
													}`}
													style={{ backgroundColor: color }}
												/>
											))}
											<div className='relative'>
												<input
													type='color'
													value={newLabelColor}
													onChange={e => setNewLabelColor(e.target.value)}
													className='absolute opacity-0 w-0 h-0'
													id='newLabelColorPicker'
												/>
												<label
													htmlFor='newLabelColorPicker'
													className='flex items-center justify-center w-8 h-8 rounded-xl cursor-pointer transition-all duration-200 hover:scale-110 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500'
													title='Custom color'
												>
													<div
														className='w-5 h-5 rounded-lg border-2 border-white shadow-sm'
														style={{ backgroundColor: newLabelColor }}
													/>
												</label>
											</div>
										</div>
									</div>

									<div className='flex gap-3'>
										<button
											onClick={handleSaveNewLabel}
											disabled={!newLabelName.trim()}
											className='px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50'
										>
											<IoSaveOutline size={16} />
											Save
										</button>
										<button
											onClick={handleCancelNewLabel}
											className='px-4 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200'
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}
					</div>{' '}
					{/* Existing Labels Section */}
					<div className='bg-[rgba(255,255,255,0.03)] rounded-xl p-5 border border-[rgba(255,255,255,0.08)]'>
						<div className='flex items-center gap-2 mb-4'>
							<IoColorPaletteOutline className='text-orange-400' size={18} />
							<h3 className='text-lg font-semibold text-white'>
								Existing Labels
							</h3>{' '}
							<span className='bg-[rgba(255,152,0,0.2)] text-orange-300 px-2 py-1 rounded-full text-xs font-medium'>
								{localLabels.filter(label => !isLabelDeleted(label)).length}
							</span>
						</div>

						{/* Labels List */}
						<div className='space-y-3'>
							{loading && localLabels.length === 0 ? (
								<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
									<div className='w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
									Loading labels...
								</div>
							) : localLabels.length > 0 ? (
								localLabels.map(label => {
									const isDeleted = isLabelDeleted(label);
									const displayName = getLabelDisplayName(label);
									const displayColor = getLabelDisplayColor(label);

									return (
										<div
											key={label.id}
											className={`p-4 rounded-xl border transition-all duration-200 ${
												isDeleted
													? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.3)] opacity-75'
													: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
											}`}
										>
											<div className='flex items-center justify-between'>
												{/* Color Selection */}
												<div className='flex items-center gap-3'>
													<div className='flex gap-2'>
														{predefinedColors.slice(0, 6).map(color => (
															<button
																key={color}
																onClick={() =>
																	!isDeleted &&
																	handleLabelColorChange(label.id, color)
																}
																className={`w-6 h-6 rounded-lg transition-all duration-200 hover:scale-110 ${
																	displayColor === color
																		? 'ring-2 ring-white ring-offset-1 ring-offset-[rgba(10,10,10,0.95)] shadow-lg'
																		: 'hover:ring-1 hover:ring-[rgba(255,255,255,0.3)]'
																} ${
																	isDeleted
																		? 'opacity-50 cursor-not-allowed'
																		: ''
																}`}
																style={{ backgroundColor: color }}
																disabled={isDeleted}
															/>
														))}
														<div className='relative'>
															<input
																type='color'
																value={displayColor}
																onChange={e =>
																	!isDeleted &&
																	handleLabelColorChange(
																		label.id,
																		e.target.value
																	)
																}
																className='absolute opacity-0 w-0 h-0'
																disabled={isDeleted}
																id={`colorPicker-${label.id}`}
															/>
															<label
																htmlFor={`colorPicker-${label.id}`}
																className={`flex items-center justify-center w-6 h-6 rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 ${
																	isDeleted
																		? 'opacity-50 cursor-not-allowed'
																		: ''
																}`}
															>
																<div
																	className='w-4 h-4 rounded border border-white/50'
																	style={{ backgroundColor: displayColor }}
																/>
															</label>
														</div>
													</div>

													{/* Label Name */}
													<div className='flex-1 ml-4'>
														{editingLabelId === label.id ? (
															<input
																type='text'
																value={displayName}
																onChange={e =>
																	handleLabelNameChange(
																		label.id,
																		e.target.value
																	)
																}
																onBlur={() => setEditingLabelId(null)}
																onKeyDown={e =>
																	handleLabelNameKeyDown(e, label.id)
																}
																autoFocus
																className='bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-white px-3 py-2 rounded-xl focus:outline-none focus:border-orange-400 transition-all duration-200 w-full'
															/>
														) : (
															<div
																onClick={() =>
																	!isDeleted && handleLabelNameClick(label.id)
																}
																className={`px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
																	isDeleted
																		? 'cursor-not-allowed'
																		: 'hover:bg-[rgba(255,255,255,0.05)]'
																}`}
															>
																<span
																	className={`inline-block px-3 py-1.5 rounded-lg text-white text-sm font-medium ${
																		isDeleted ? 'line-through opacity-75' : ''
																	}`}
																	style={{ backgroundColor: displayColor }}
																>
																	{displayName}
																</span>
																{isDeleted && (
																	<span className='ml-2 text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded-full'>
																		Will be deleted
																	</span>
																)}
															</div>
														)}
													</div>
												</div>

												{/* Actions */}
												<div className='flex items-center gap-2 ml-3'>
													{isDeleted ? (
														<button
															onClick={() => handleRestoreLabel(label.id)}
															className='p-2 text-green-400 hover:text-green-300 hover:bg-[rgba(34,197,94,0.1)] rounded-lg transition-all duration-200'
															title='Restore label'
														>
															<IoRefreshOutline size={16} />
														</button>
													) : (
														<button
															onClick={() => handleDeleteLabel(label.id)}
															className='p-2 text-[rgba(255,255,255,0.5)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-all duration-200'
															title='Delete label'
														>
															<IoTrash size={16} />
														</button>
													)}
												</div>
											</div>
										</div>
									);
								})
							) : (
								<div className='text-center py-8 text-[rgba(255,255,255,0.5)]'>
									<IoColorPaletteOutline
										size={32}
										className='mx-auto mb-2 opacity-50'
									/>
									<p>No labels in this project yet</p>
								</div>
							)}
						</div>

						<p className='text-xs text-[rgba(255,255,255,0.5)] mt-4'>
							Click on label name to edit. Select colors from the palette or use
							custom color picker.
						</p>
					</div>
				</div>{' '}
				{/* Footer */}
				<div className='flex justify-between items-center px-6 py-4 border-t border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'>
					<div className='text-sm text-[rgba(255,255,255,0.6)]'>
						{hasChanges() && (
							<span className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-orange-400 rounded-full animate-pulse'></div>
								Unsaved changes
							</span>
						)}
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={handleCancel}
							disabled={loading}
							className='px-6 py-2.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.8)] hover:text-white rounded-xl transition-all duration-200 disabled:opacity-50'
						>
							Cancel
						</button>
						<button
							onClick={handleSaveChanges}
							disabled={loading || !hasChanges()}
							className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
								hasChanges()
									? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg'
									: 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]'
							}`}
						>
							{loading ? (
								<>
									<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
									Saving...
								</>
							) : (
								<>
									<IoSaveOutline size={16} />
									Save Changes
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
