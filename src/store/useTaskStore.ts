import { create } from "zustand";
import type { Task, Status } from "../types/task";
import { generateTasks } from "../utils/utils";

interface Filters {
	status: string[];
	priority: string[];
}

interface ActiveUsers {
	[userId: string]: string;
}

interface TaskState {
	tasks: Task[];
	filters: Filters;
	activeUsers: ActiveUsers;
	setFilters: (filters: Partial<Filters>) => void;
	updateTaskStatus: (id: string, status: Status) => void;
	setActiveUsers: (users: ActiveUsers) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
	tasks: generateTasks(500),
	filters: {
		status: [],
		priority: [],
	},
	activeUsers: {},

	setFilters: (newFilters) =>
		set((state) => ({
			filters: { ...state.filters, ...newFilters },
		})),

	updateTaskStatus: (id, status) =>
		set((state) => ({
			tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
		})),

	setActiveUsers: (users) => set({ activeUsers: users }),
}));
