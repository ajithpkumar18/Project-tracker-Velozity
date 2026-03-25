export type Status = "todo" | "in-progress" | "in-review" | "done";
export type Priority = "critical" | "high" | "medium" | "low";

export interface Task {
	id: string;
	title: string;
	assignee: string;
	status: Status;
	priority: Priority;
	startDate?: string;
	dueDate: string;
}
