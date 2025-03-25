import { create } from 'zustand';

type ProjectAndBoards = Record<string, string[]>;

type Task = {
	id: number;
	status: string;
	header: string;
	description: string;
	labels: string[];
};

type Column = {
	id: number;
	name: string;
};

interface TaskState {
	projectVisible: boolean;
	boardVisible: boolean;
	modalVisible: boolean;
	notifOpen: boolean;
	createTaskOpen: boolean;
	settingsOpen: boolean;
	selectedProject: string;
	selectedBoard: string;
	projectsAndBoards: ProjectAndBoards;
	tasks: Task[];
	columns: Column[];

	setProjectVisible: (visible: boolean) => void;
	setBoardVisible: (visible: boolean) => void;
	setModalVisible: (visible: boolean) => void;
	setCreateTaskOpen: (open: boolean) => void;
	setNotifOpen: (open: boolean) => void;
	setSettingsOpen: (open: boolean) => void;
	selectProject: (project: string) => void;
	selectBoard: (board: string) => void;
	handleModalSelection: (project: string, board: string) => void;
	toggleNotifications: () => void;
	toggleSettings: () => void;
	setTasks: (tasks: Task[]) => void; // New action to set tasks
	setColumns: (columns: Column[]) => void; // New action to set columns
	addTask: (task: Omit<Task, 'id'>) => void; // Optional: Add a task
	moveTask: (taskId: number, newStatus: string) => void; // Optional: Move task between columns
}

export const useTaskStore = create<TaskState>(set => ({
	projectVisible: false,
	boardVisible: false,
	modalVisible: false,
	createTaskOpen: false,
	notifOpen: false,
	settingsOpen: false,
	selectedProject: 'Marketing',
	selectedBoard: 'Sprint 1',
	projectsAndBoards: {
		Marketing: ['Sprint 1', 'Sprint 2'],
		Development: ['Bug Fixes', 'Feature Development'],
		Design: ['UI Improvements', 'UX Research'],
		Sales: ['Client Outreach', 'Lead Generation'],
		test1: ['Client Outreach', 'Lead Generation'],
		test2: ['Client Outreach', 'Lead Generation'],
		test3: ['Client Outreach', 'Lead Generation'],
		test4: ['Client Outreach', 'Lead Generation'],
		test5: ['Client Outreach', 'Lead Generation'],
		test6: ['Client Outreach', 'Lead Generation'],
		test7: ['Client Outreach', 'Lead Generation'],
		test8: ['Client Outreach', 'Lead Generation'],
		test9: ['Client Outreach', 'Lead Generation'],
		test10: ['Client Outreach', 'Lead Generation'],
	},
	tasks: [
		{
			id: 1,
			status: 'backlog',
			header: 'Task1',
			description: 'Lorem ipsum dolor',
			labels: ['#ef4444', '#4ade80', '#60a5fa'],
		},
		{
			id: 2,
			status: 'backlog',
			header: 'Task1',
			description: 'Lorem ipsum dolor',
			labels: ['#4ade80', '#60a5fa'],
		},
		{
			id: 3,
			status: 'backlog',
			header: 'Task1',
			description: 'Lorem ipsum dolor',
			labels: ['#ef4444', '#60a5fa'],
		},
		{
			id: 4,
			status: 'backlog',
			header:
				'Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolor',
			description: 'Lorem ipsum dolor',
			labels: ['#60a5fa'],
		},
		{
			id: 5,
			status: 'backlog',
			header:
				'Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolorLorem ipsum dolor',
			description: 'Lorem ipsum dolor',
			labels: ['#ef4444'],
		},
		{
			id: 6,
			status: 'backlog',
			header: 'Task2',
			description: 'Lorem ipsum dolor',
			labels: ['#ef4444', '#60a5fa'],
		},
		{
			id: 7,
			status: 'doing',
			header: 'Task3',
			description: 'Lorem ipsum dolor',
			labels: ['#4ade80', '#ef4444', '#60a5fa'],
		},
		{
			id: 8,
			status: 'review',
			header: 'Task4',
			description: 'Lorem ipsum dolor',
			labels: ['#4ade80', '#60a5fa'],
		},
	],
	columns: [
		{ id: 1, name: 'backlog' },
		{ id: 2, name: 'doing' },
		{ id: 3, name: 'review' },
		{ id: 4, name: 'done' },
		{ id: 5, name: 'rework' },
		{ id: 6, name: 'Steve Jobs' },
	],
	setProjectVisible: visible => set({ projectVisible: visible }),
	setBoardVisible: visible => set({ boardVisible: visible }),
	setModalVisible: visible => set({ modalVisible: visible }),
	setCreateTaskOpen: open => set({ createTaskOpen: open }),
	setNotifOpen: open => set({ notifOpen: open }),
	setSettingsOpen: open => set({ settingsOpen: open }),
	selectProject: project =>
		set(state => ({
			selectedProject: project,
			selectedBoard: state.projectsAndBoards[project][0],
			projectVisible: false,
		})),
	selectBoard: board => set({ selectedBoard: board, boardVisible: false }),
	handleModalSelection: (project, board) =>
		set({
			selectedProject: project,
			selectedBoard: board,
			modalVisible: false,
		}),
	toggleNotifications: () =>
		set(state => ({ notifOpen: !state.notifOpen, settingsOpen: false })),
	toggleSettings: () =>
		set(state => ({ settingsOpen: !state.settingsOpen, notifOpen: false })),

	setTasks: tasks => set({ tasks }),
	setColumns: columns => set({ columns }),
	addTask: task =>
		set(state => ({
			tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }],
		})),
	moveTask: (taskId, newStatus) =>
		set(state => ({
			tasks: state.tasks.map(task =>
				task.id === taskId ? { ...task, status: newStatus } : task
			),
		})),
}));
