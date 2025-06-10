import { create } from 'zustand';
import {
	Project,
	Board,
	Task,
	Column,
	User,
	Label,
	ProjectService,
	BoardService,
	TaskService,
	ColumnService,
	UserService,
	LabelService,
} from '../api';
import Cookies from 'js-cookie';

// Constants for localStorage keys
const SELECTED_PROJECT_KEY = 'trackIt_selectedProject';
const SELECTED_BOARD_KEY = 'trackIt_selectedBoard';

// Helper functions for localStorage
const saveSelectedProject = (project: Project | null) => {
	if (typeof window !== 'undefined') {
		if (project) {
			localStorage.setItem(SELECTED_PROJECT_KEY, JSON.stringify(project));
		} else {
			localStorage.removeItem(SELECTED_PROJECT_KEY);
		}
	}
};

const saveSelectedBoard = (board: Board | null) => {
	if (typeof window !== 'undefined') {
		if (board) {
			localStorage.setItem(SELECTED_BOARD_KEY, JSON.stringify(board));
		} else {
			localStorage.removeItem(SELECTED_BOARD_KEY);
		}
	}
};

const loadSelectedProject = (): Project | null => {
	if (typeof window !== 'undefined') {
		try {
			const saved = localStorage.getItem(SELECTED_PROJECT_KEY);
			return saved ? JSON.parse(saved) : null;
		} catch {
			return null;
		}
	}
	return null;
};

const loadSelectedBoard = (): Board | null => {
	if (typeof window !== 'undefined') {
		try {
			const saved = localStorage.getItem(SELECTED_BOARD_KEY);
			return saved ? JSON.parse(saved) : null;
		} catch {
			return null;
		}
	}
	return null;
};

interface TaskState {
	// UI State
	projectVisible: boolean;
	boardVisible: boolean;
	modalVisible: boolean;
	notifOpen: boolean;
	createTaskOpen: boolean;
	settingsOpen: boolean;
	taskDetailOpen: boolean;
	selectedTaskForDetail: Task | null;
	preselectedColumnId: string | null; // Добавляем предварительно выбранную колонку
	loading: boolean;
	error: string | null;

	// Data State
	user: User | null;
	projects: Project[];
	boards: Board[];
	tasks: Task[];
	columns: Column[];
	labels: Label[];
	selectedProject: Project | null;
	selectedBoard: Board | null;
	// UI Actions
	setProjectVisible: (visible: boolean) => void;
	setBoardVisible: (visible: boolean) => void;
	setModalVisible: (visible: boolean) => void;
	setCreateTaskOpen: (open: boolean) => void;
	setNotifOpen: (open: boolean) => void;
	setSettingsOpen: (open: boolean) => void;
	setTaskDetailOpen: (open: boolean) => void;
	setSelectedTaskForDetail: (task: Task | null) => void;
	setPreselectedColumnId: (columnId: string | null) => void; // Добавляем функцию
	toggleNotifications: () => void;
	toggleSettings: () => void;

	// Data Actions
	loadUserProfile: () => Promise<void>;
	loadProjects: () => Promise<void>;
	loadBoards: (projectId: string) => Promise<void>;
	loadTasks: () => Promise<void>;
	loadColumns: (boardId: string) => Promise<void>;
	loadLabels: (projectId?: string) => Promise<void>;
	selectProject: (project: Project) => Promise<void>;
	selectBoard: (board: Board) => Promise<void>;
	handleModalSelection: (project: Project, board: Board) => Promise<void>;

	// CRUD Actions
	createProject: (name: string) => Promise<void>;
	createBoard: (
		projectId: string,
		name: string,
		description?: string
	) => Promise<void>;
	createTask: (
		columnId: string,
		title: string,
		description?: string,
		labelIds?: string[]
	) => Promise<void>;
	createColumn: (boardId: string, name: string) => Promise<void>;
	createLabel: (
		name: string,
		color: string,
		projectId?: string
	) => Promise<void>;
	updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
	updateProject: (projectId: string, name: string) => Promise<void>;
	updateBoard: (
		projectId: string,
		boardId: string,
		name: string
	) => Promise<void>;
	updateLabel: (
		labelId: string,
		name?: string,
		color?: string
	) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;
	deleteProject: (projectId: string) => Promise<void>;
	deleteBoard: (projectId: string, boardId: string) => Promise<void>;
	deleteLabel: (labelId: string) => Promise<void>;
	updateColumn: (columnId: string, name: string) => Promise<void>;
	deleteColumn: (columnId: string) => Promise<void>;
	moveTask: (taskId: string, newColumnId: string) => Promise<void>;

	// Auth check
	checkAuth: () => boolean;
	clearStore: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
	// Initial UI State
	projectVisible: false,
	boardVisible: false,
	modalVisible: false,
	createTaskOpen: false,
	notifOpen: false,
	settingsOpen: false,
	taskDetailOpen: false,
	selectedTaskForDetail: null,
	preselectedColumnId: null,
	loading: false,
	error: null,

	// Initial Data State
	user: null,
	projects: [],
	boards: [],
	tasks: [],
	columns: [],
	labels: [],
	selectedProject: null,
	selectedBoard: null,
	// UI Actions
	setProjectVisible: visible => set({ projectVisible: visible }),
	setBoardVisible: visible => set({ boardVisible: visible }),
	setModalVisible: visible => set({ modalVisible: visible }),
	setCreateTaskOpen: open => set({ createTaskOpen: open }),
	setNotifOpen: open => set({ notifOpen: open }),
	setSettingsOpen: open => set({ settingsOpen: open }),
	setTaskDetailOpen: open => set({ taskDetailOpen: open }),
	setSelectedTaskForDetail: task => set({ selectedTaskForDetail: task }),
	setPreselectedColumnId: columnId => set({ preselectedColumnId: columnId }),
	toggleNotifications: () =>
		set(state => ({ notifOpen: !state.notifOpen, settingsOpen: false })),
	toggleSettings: () =>
		set(state => ({ settingsOpen: !state.settingsOpen, notifOpen: false })),

	// Auth check
	checkAuth: () => {
		const token = Cookies.get('accessToken');
		return !!token;
	},
	clearStore: () => {
		// Clear localStorage
		saveSelectedProject(null);
		saveSelectedBoard(null);

		set({
			user: null,
			projects: [],
			boards: [],
			tasks: [],
			columns: [],
			labels: [],
			selectedProject: null,
			selectedBoard: null,
			projectVisible: false,
			boardVisible: false,
			modalVisible: false,
			createTaskOpen: false,
			notifOpen: false,
			settingsOpen: false,
			taskDetailOpen: false,
			selectedTaskForDetail: null,
			preselectedColumnId: null,
			loading: false,
			error: null,
		});
	},

	// Data Loading Actions
	loadUserProfile: async () => {
		try {
			set({ loading: true, error: null });
			const user = await UserService.getProfile();
			set({ user, loading: false });
		} catch (error) {
			set({ error: 'Failed to load user profile', loading: false });
		}
	},
	loadProjects: async () => {
		try {
			set({ loading: true, error: null });
			const projects = await ProjectService.getAllDetailed();
			set({ projects, loading: false });

			// Try to restore previously selected project and board
			const savedProject = loadSelectedProject();
			const savedBoard = loadSelectedBoard();

			let projectToSelect: Project | null = null;
			let boardToSelect: Board | null = null;

			if (savedProject) {
				// Find the saved project in the loaded projects
				projectToSelect = projects.find(p => p.id === savedProject.id) || null;

				if (projectToSelect && savedBoard) {
					// Find the saved board in the selected project
					boardToSelect =
						projectToSelect.boards?.find(b => b.id === savedBoard.id) || null;
				}
			}

			// If no saved project or it doesn't exist anymore, select first project
			if (!projectToSelect && projects.length > 0) {
				projectToSelect = projects[0];
			}

			// Select the project (and board if available)
			if (projectToSelect) {
				if (boardToSelect) {
					await get().handleModalSelection(projectToSelect, boardToSelect);
				} else {
					await get().selectProject(projectToSelect);
				}
			}
		} catch (error) {
			set({ error: 'Failed to load projects', loading: false });
		}
	},

	loadBoards: async (projectId: string) => {
		try {
			set({ loading: true, error: null });
			const boards = await BoardService.getAll(projectId);
			set({ boards, loading: false });

			// Auto-select first board if none selected
			const { selectedBoard } = get();
			if (!selectedBoard && boards.length > 0) {
				await get().selectBoard(boards[0]);
			}
		} catch (error) {
			set({ error: 'Failed to load boards', loading: false });
		}
	},

	loadTasks: async () => {
		try {
			set({ loading: true, error: null });
			const tasks = await TaskService.getAll();
			set({ tasks, loading: false });
		} catch (error) {
			set({ error: 'Failed to load tasks', loading: false });
		}
	},

	loadColumns: async (boardId: string) => {
		try {
			set({ loading: true, error: null });
			const columns = await ColumnService.getAll(boardId);
			set({ columns, loading: false });
		} catch (error) {
			set({ error: 'Failed to load columns', loading: false });
		}
	},

	loadLabels: async (projectId?: string) => {
		try {
			set({ loading: true, error: null });
			const labels = projectId
				? await LabelService.getByProject(projectId)
				: await LabelService.getAll();
			set({ labels, loading: false });
		} catch (error) {
			set({ error: 'Failed to load labels', loading: false });
		}
	},
	// Selection Actions
	selectProject: async (project: Project) => {
		set({
			selectedProject: project,
			projectVisible: false,
			selectedBoard: null,
			boards: [],
			columns: [],
			tasks: [],
		});

		// Save selected project to localStorage
		saveSelectedProject(project);
		// Clear selected board since we're changing projects
		saveSelectedBoard(null);

		await get().loadBoards(project.id);
		await get().loadLabels(project.id);
	},

	selectBoard: async (board: Board) => {
		set({
			selectedBoard: board,
			boardVisible: false,
			columns: [],
			tasks: [],
		});

		// Save selected board to localStorage
		saveSelectedBoard(board);

		await get().loadColumns(board.id);
		await get().loadTasks();
	},

	handleModalSelection: async (project: Project, board: Board) => {
		set({
			selectedProject: project,
			selectedBoard: board,
			modalVisible: false,
		});

		// Save both project and board to localStorage
		saveSelectedProject(project);
		saveSelectedBoard(board);

		await get().loadColumns(board.id);
		await get().loadTasks();
		await get().loadLabels(project.id);
	},

	// CRUD Actions
	createProject: async (name: string) => {
		try {
			set({ loading: true, error: null });
			const newProject = await ProjectService.create({ name });
			set(state => ({
				projects: [...state.projects, newProject],
				selectedProject: newProject,
				selectedBoard: null,
				boards: [],
				tasks: [],
				columns: [],
				loading: false,
			}));
		} catch (error: any) {
			set({
				error: error.response?.data?.message || 'Failed to create project',
				loading: false,
			});
			throw error;
		}
	},
	createBoard: async (projectId: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const newBoard = await BoardService.create(projectId, { name });
			set(state => {
				const updatedProjects = state.projects.map(project =>
					project.id === projectId
						? { ...project, boards: [...(project.boards || []), newBoard] }
						: project
				);

				// Update selectedProject if it's the same project where we added the board
				const updatedSelectedProject =
					state.selectedProject?.id === projectId
						? updatedProjects.find(p => p.id === projectId)
						: state.selectedProject;
				return {
					boards: [...state.boards, newBoard],
					selectedBoard: newBoard,
					projects: updatedProjects,
					selectedProject: updatedSelectedProject,
					columns: [],
					tasks: [],
					loading: false,
				};
			});

			// Save the new board to localStorage since it's now selected
			saveSelectedBoard(newBoard);

			await get().loadColumns(newBoard.id);
			await get().loadTasks();
		} catch (error: any) {
			set({
				error: error.response?.data?.message || 'Failed to create board',
				loading: false,
			});
			throw error;
		}
	},

	createTask: async (
		columnId: string,
		title: string,
		description?: string,
		labelIds?: string[]
	) => {
		try {
			set({ loading: true, error: null });

			// Если labelIds содержат цвета (fallback лейблы), создаем задачу с лейблами как цветами
			const isUsingColors = labelIds?.some(id => id.startsWith('#'));

			const newTask = await TaskService.create(columnId, {
				title,
				description,
				labelIds: isUsingColors ? undefined : labelIds,
			});

			// Если используем цвета, добавляем их прямо в задачу для отображения
			if (isUsingColors && labelIds) {
				newTask.labels = labelIds.map(color => ({
					id: color, // Use color as a temporary id or generate a unique id if needed
					name: color, // Or use a placeholder name
					color,
					projectId: '', // Fallback for legacy colors
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}));
			}

			set(state => ({
				tasks: [...state.tasks, newTask],
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to create task', loading: false });
		}
	},

	createColumn: async (boardId: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const newColumn = await ColumnService.create(boardId, { name });
			set(state => ({
				columns: [...state.columns, newColumn],
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to create column', loading: false });
		}
	},
	updateTask: async (taskId: string, data: Partial<Task>) => {
		try {
			set({ loading: true, error: null });
			const updatedTask = await TaskService.update(taskId, data as any);
			set(state => ({
				tasks: state.tasks.map(task =>
					task.id === taskId ? updatedTask : task
				),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to update task', loading: false });
		}
	},
	updateProject: async (projectId: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const updatedProject = await ProjectService.update(projectId, { name });
			set(state => ({
				projects: state.projects.map(project =>
					project.id === projectId ? { ...project, name } : project
				),
				selectedProject:
					state.selectedProject?.id === projectId
						? { ...state.selectedProject, name }
						: state.selectedProject,
				loading: false,
			}));

			// Update localStorage if this is the current project
			const state = get();
			if (state.selectedProject?.id === projectId) {
				saveSelectedProject(state.selectedProject);
			}
		} catch (error) {
			set({ error: 'Failed to update project', loading: false });
			throw error;
		}
	},
	updateBoard: async (projectId: string, boardId: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const updatedBoard = await BoardService.update(projectId, boardId, {
				name,
			});
			set(state => {
				const updatedProjects = state.projects.map(project =>
					project.id === projectId
						? {
								...project,
								boards: project.boards?.map(board =>
									board.id === boardId ? { ...board, name } : board
								),
						  }
						: project
				);

				// Update selectedProject to point to the updated project
				const updatedSelectedProject =
					state.selectedProject?.id === projectId
						? updatedProjects.find(p => p.id === projectId)
						: state.selectedProject;
				return {
					projects: updatedProjects,
					selectedProject: updatedSelectedProject,
					selectedBoard:
						state.selectedBoard?.id === boardId
							? { ...state.selectedBoard, name }
							: state.selectedBoard,
					loading: false,
				};
			});

			// Update localStorage if this is the current board
			const state = get();
			if (state.selectedBoard?.id === boardId) {
				saveSelectedBoard(state.selectedBoard);
			}
		} catch (error) {
			set({ error: 'Ошибка обновления доски', loading: false });
			throw error;
		}
	},

	deleteTask: async (taskId: string) => {
		try {
			set({ loading: true, error: null });
			// Удаляем задачу только из локального состояния
			// API вызов уже был выполнен в компоненте
			set(state => ({
				tasks: state.tasks.filter(task => task.id !== taskId),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to delete task', loading: false });
			throw error;
		}
	},
	deleteProject: async (projectId: string) => {
		try {
			set({ loading: true, error: null });
			await ProjectService.delete(projectId);

			const state = get();
			const isCurrentProject = state.selectedProject?.id === projectId;

			set(state => ({
				projects: state.projects.filter(project => project.id !== projectId),
				selectedProject:
					state.selectedProject?.id === projectId
						? null
						: state.selectedProject,
				selectedBoard:
					state.selectedProject?.id === projectId ? null : state.selectedBoard,
				boards: state.selectedProject?.id === projectId ? [] : state.boards,
				columns: state.selectedProject?.id === projectId ? [] : state.columns,
				tasks: state.selectedProject?.id === projectId ? [] : state.tasks,
				loading: false,
			}));

			// Clear localStorage if we deleted the current project
			if (isCurrentProject) {
				saveSelectedProject(null);
				saveSelectedBoard(null);
			}
		} catch (error) {
			set({ error: 'Failed to delete project', loading: false });
			throw error;
		}
	},
	deleteBoard: async (projectId: string, boardId: string) => {
		try {
			set({ loading: true, error: null });
			await BoardService.delete(projectId, boardId);

			const state = get();
			const isCurrentBoard = state.selectedBoard?.id === boardId;

			set(state => ({
				boards: state.boards.filter(board => board.id !== boardId),
				selectedBoard:
					state.selectedBoard?.id === boardId ? null : state.selectedBoard,
				columns: state.selectedBoard?.id === boardId ? [] : state.columns,
				tasks: state.selectedBoard?.id === boardId ? [] : state.tasks,
				loading: false,
			}));

			// Clear board from localStorage if we deleted the current board
			if (isCurrentBoard) {
				saveSelectedBoard(null);
			}
		} catch (error) {
			set({ error: 'Failed to delete board', loading: false });
			throw error;
		}
	},

	updateColumn: async (columnId: string, name: string) => {
		try {
			set({ loading: true, error: null });
			const updatedColumn = await ColumnService.update(columnId, { name });
			set(state => ({
				columns: state.columns.map(column =>
					column.id === columnId ? { ...column, name } : column
				),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to update column', loading: false });
			throw error;
		}
	},

	deleteColumn: async (columnId: string) => {
		try {
			set({ loading: true, error: null });
			await ColumnService.delete(columnId);
			set(state => ({
				columns: state.columns.filter(column => column.id !== columnId),
				tasks: state.tasks.filter(task => task.columnId !== columnId),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to delete column', loading: false });
			throw error;
		}
	},

	moveTask: async (taskId: string, newColumnId: string) => {
		try {
			set({ loading: true, error: null });
			// Найдем задачу и обновим её columnId
			const { tasks } = get();
			const task = tasks.find(t => t.id === taskId);
			if (task) {
				await TaskService.update(taskId, {
					...task,
					columnId: newColumnId,
				} as any);
				set(state => ({
					tasks: state.tasks.map(task =>
						task.id === taskId ? { ...task, columnId: newColumnId } : task
					),
					loading: false,
				}));
			}
		} catch (error) {
			set({ error: 'Failed to move task', loading: false });
		}
	},

	// Label CRUD Actions
	createLabel: async (name: string, color: string, projectId?: string) => {
		try {
			set({ loading: true, error: null });
			const newLabel = await LabelService.create({ name, color, projectId });
			set(state => ({
				labels: [...state.labels, newLabel],
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to create label', loading: false });
		}
	},

	updateLabel: async (labelId: string, name?: string, color?: string) => {
		try {
			set({ loading: true, error: null });
			const updateData: any = {};
			if (name !== undefined) updateData.name = name;
			if (color !== undefined) updateData.color = color;

			const updatedLabel = await LabelService.update(labelId, updateData);
			set(state => ({
				labels: state.labels.map(label =>
					label.id === labelId ? updatedLabel : label
				),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to update label', loading: false });
		}
	},

	deleteLabel: async (labelId: string) => {
		try {
			set({ loading: true, error: null });
			await LabelService.delete(labelId);
			set(state => ({
				labels: state.labels.filter(label => label.id !== labelId),
				loading: false,
			}));
		} catch (error) {
			set({ error: 'Failed to delete label', loading: false });
		}
	},
}));
