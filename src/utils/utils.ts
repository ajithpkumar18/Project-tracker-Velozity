import type { Task, Status, Priority } from "../types/task";

const colors = [
	"bg-red-400",
	"bg-blue-400",
	"bg-green-400",
	"bg-purple-400",
	"bg-pink-400",
	"bg-yellow-400",
];

const statuses: Status[] = ["todo", "in-progress", "in-review", "done"];
const priorities: Priority[] = ["critical", "high", "medium", "low"];
export const users = [
	{ id: "u1", name: "AJ" },
	{ id: "u2", name: "RK" },
	{ id: "u3", name: "MS" },
	{ id: "u4", name: "PP" },
	{ id: "u5", name: "DK" },
	{ id: "u6", name: "TS" },
];

function randomDate(offset = 0) {
	const d = new Date();
	d.setDate(d.getDate() + offset + Math.floor(Math.random() * 20));
	return d.toISOString().split("T")[0];
}

export function generateTasks(count = 500): Task[] {
	return Array.from({ length: count }).map((_, i) => {
		const startOffset = Math.floor(Math.random() * 10) - 5;
		const hasStart = Math.random() > 0.2;

		const randomUser = users[Math.floor(Math.random() * users.length)];

		return {
			id: `task-${i}`,
			title: `Task ${i}`,
			assignee: randomUser.name, // ✅ fixed
			status: statuses[Math.floor(Math.random() * statuses.length)],
			priority: priorities[Math.floor(Math.random() * priorities.length)],
			startDate: hasStart ? randomDate(startOffset) : undefined,
			dueDate: randomDate(startOffset + 5),
		};
	});
}

export function getUserColor(id: string) {
	let sum = 0;
	for (let i = 0; i < id.length; i++) {
		sum += id.charCodeAt(i);
	}
	return colors[sum % colors.length];
}
