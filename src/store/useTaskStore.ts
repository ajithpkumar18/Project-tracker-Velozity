import { create } from "zustand";
import type { Task, Status } from "../types/task";
import { generateTasks } from "../utils/utils";

interface Filters {
	status: string[];
	priority: string[];
}

interface TaskState {
	tasks: Task[];
	filters: Filters;
	setFilters: (filters: Partial<Filters>) => void;
	updateTaskStatus: (id: string, status: Status) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
	tasks: generateTasks(500),
	filters: {
		status: [],
		priority: [],
	},

	setFilters: (newFilters) =>
		set((state) => ({
			filters: { ...state.filters, ...newFilters },
		})),

	updateTaskStatus: (id, status) =>
		set((state) => ({
			tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
			draggingTaskId: null,
		})),
}));
