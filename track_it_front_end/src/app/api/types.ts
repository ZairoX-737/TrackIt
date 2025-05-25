// Auth types
export interface AuthDto {
	email: string;
	username: string; // добавляем username для логина
	password: string;
}

export interface RegisterDto {
	email: string;
	password: string;
	username: string; // изменили name на username
}

export interface AuthResponse {
	user: User;
	accessToken: string;
}

// User types
export interface User {
	id: string;
	email: string;
	username?: string; // исправляем name на username
	createdAt: string;
	updatedAt: string;
}

export interface UserDto {
	email?: string;
	password?: string;
	username?: string; // исправляем name на username
}

// Project types
export interface Project {
	id: string;
	name: string;
	description?: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
	boards?: Board[];
	users?: User[];
}

export interface ProjectDto {
	name: string;
}

// Board types
export interface Board {
	id: string;
	name: string;
	description?: string;
	projectId: string;
	createdAt: string;
	updatedAt: string;
	columns?: Column[];
}

export interface BoardDto {
	name: string;
	// убираем description так как его нет на бэкенде
}

// Column types
export interface Column {
	id: string;
	name: string;
	position: number;
	boardId: string;
	createdAt: string;
	updatedAt: string;
	tasks?: Task[];
}

export interface ColumnDto {
	name: string;
	position?: number;
}

// Task types
export enum Priority {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export interface Task {
	id: string;
	title: string;
	description?: string;
	status: string;
	priority?: Priority; // исправляем на нижний регистр
	dueDate?: string;
	columnId: string;
	createdBy: string;
	assignedTo?: string;
	createdAt: string;
	updatedAt: string;
	labels?: Label[];
	user?: {
		id: string;
		username?: string;
		email: string;
	};
	comments?: Comment[];
}

export interface TaskDto {
	title: string;
	description?: string;
	status: string;
	priority?: Priority; // исправляем на нижний регистр
	dueDate?: string;
	assignedTo?: string;
	labelIds?: string[];
	columnId?: string;
}

// Label types
export interface Label {
	id: string;
	name: string;
	color: string;
	createdAt: string;
	updatedAt: string;
}

// Comment types
export interface Comment {
	id: string;
	content: string;
	taskId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}
