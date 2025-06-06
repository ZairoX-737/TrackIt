import { useState } from 'react';
import styles from './Components.module.scss';
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
			<div className={styles.modalOverlay} onClick={onClose}>
				{' '}
				<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
					<p>No projects available</p>
					<button onClick={onClose}>Close</button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={e => e.stopPropagation()}>
				<div className={styles.modalColumns}>
					{/* Left column: projects */}
					<div className={styles.projectColumn}>
						<h3 className='select-none'>Projects</h3>
						<ul>
							{projects.map(project => (
								<li
									key={project.id}
									className={
										selectedProjectInModal?.id === project.id
											? styles.selected
											: ''
									}
									onClick={() => setSelectedProjectInModal(project)}
								>
									{project.name}
								</li>
							))}
						</ul>
						<div
							style={{
								borderTop: '1px solid #444',
								marginTop: '8px',
								paddingTop: '8px',
							}}
						>
							{' '}
							<button
								className={styles.createButton}
								onClick={() => {
									onCreateProject?.();
									onClose();
								}}
							>
								+ Create Project
							</button>
						</div>
					</div>
					{/* Right column: boards */}
					<div className={styles.boardColumn}>
						<h3 className='select-none'>
							Boards for {selectedProjectInModal?.name || 'Select Project'}
						</h3>
						<ul>
							{selectedProjectInModal?.boards &&
							selectedProjectInModal.boards.length > 0 ? (
								selectedProjectInModal.boards.map(board => (
									<li
										key={board.id}
										onClick={() => onSelect(selectedProjectInModal, board)}
									>
										{board.name}
									</li>
								))
							) : (
								<li>No boards available</li>
							)}
						</ul>
						<div
							style={{
								borderTop: '1px solid #444',
								marginTop: '8px',
								paddingTop: '8px',
							}}
						>
							{' '}
							<button
								className={styles.createButton}
								onClick={() => {
									onCreateBoard?.();
									onClose();
								}}
								disabled={!selectedProjectInModal}
							>
								+ Create Board
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
