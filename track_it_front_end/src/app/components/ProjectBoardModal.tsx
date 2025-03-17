import { useState } from 'react';
import styles from './Components.module.scss';

interface ProjectBoardModalProps {
	isOpen: boolean;
	onClose: () => void;
	projectsAndBoards: Record<string, string[]>;
	selectedProject: string;
	onSelect: (project: string, board: string) => void;
}

export default function ProjectBoardModal({
	isOpen,
	onClose,
	projectsAndBoards,
	selectedProject,
	onSelect,
}: ProjectBoardModalProps) {
	const [selectedProjectInModal, setSelectedProjectInModal] =
		useState<string>(selectedProject);

	if (!isOpen) return null;

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
					</div>
					{/* Right column: boards */}
					<div className={styles.boardColumn}>
						<h3 className='select-none'>Boards for {selectedProjectInModal}</h3>
						<ul>
							{projectsAndBoards[selectedProjectInModal].map(board => (
								<li
									key={board}
									onClick={() => onSelect(selectedProjectInModal, board)}
								>
									{board}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
