import { useState } from 'react';
import styles from './Components.module.scss';

interface ProjectBoardModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectsAndBoards: Record<string, string[]>;
	selectedProject: string;
	onSelect: (project: string, board: string) => void;
	onCreateProject?: () => void;
	onCreateBoard?: () => void;
}

export default function ProjectBoardModal({
	isOpen,
	onClose,
	projectsAndBoards,
	selectedProject,
	onSelect,
	onCreateProject,
	onCreateBoard,
}: ProjectBoardModalProps) {
	const [selectedProjectInModal, setSelectedProjectInModal] = useState<string>(
		selectedProject ||
			(projectsAndBoards ? Object.keys(projectsAndBoards)[0] : '') ||
			''
	);

	if (!isOpen) return null;

	// Если нет проектов, не показываем модалку
	if (!projectsAndBoards || Object.keys(projectsAndBoards).length === 0) {
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
							{Object.keys(projectsAndBoards).map(project => (
								<li
									key={project}
									className={
										selectedProjectInModal === project ? styles.selected : ''
									}
									onClick={() => setSelectedProjectInModal(project)}
								>
									{project}
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
						<h3 className='select-none'>Boards for {selectedProjectInModal}</h3>
						<ul>
							{selectedProjectInModal &&
							projectsAndBoards[selectedProjectInModal] ? (
								projectsAndBoards[selectedProjectInModal].map(board => (
									<li
										key={board}
										onClick={() => onSelect(selectedProjectInModal, board)}
									>
										{board}
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
