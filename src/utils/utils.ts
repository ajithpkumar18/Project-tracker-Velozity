import type { Task, Status, Priority } from "../types/task";

const statuses: Status[] = ["todo", "in-progress", "in-review", "done"];
const priorities: Priority[] = ["critical", "high", "medium", "low"];
const users = ["AJ", "RK", "MS", "PP", "DK", "TS"];

function randomDate(offset = 0) {
	const d = new Date();
	d.setDate(d.getDate() + offset + Math.floor(Math.random() * 20));
	return d.toISOString().split("T")[0];
}

export function generateTasks(count = 500): Task[] {
	return Array.from({ length: count }).map((_, i) => {
		const startOffset = Math.floor(Math.random() * 10) - 5;
		const hasStart = Math.random() > 0.2;

		return {
			id: `task-${i}`,
			title: `Task ${i}`,
			assignee: users[Math.floor(Math.random() * users.length)],
			status: statuses[Math.floor(Math.random() * statuses.length)],
			priority: priorities[Math.floor(Math.random() * priorities.length)],
			startDate: hasStart ? randomDate(startOffset) : undefined,
			dueDate: randomDate(startOffset + 5),
		};
	});
}
