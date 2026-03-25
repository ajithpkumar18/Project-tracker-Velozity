import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { users } from "../utils/utils";

export function useCollabSimulation() {
	const tasks = useTaskStore((s) => s.tasks);
	const setActiveUsers = useTaskStore((s) => s.setActiveUsers);

	useEffect(() => {
		const interval = setInterval(() => {
			const updates: Record<string, string> = {};

			users.forEach((u) => {
				const randomTask =
					tasks[Math.floor(Math.random() * tasks.length)];
				if (randomTask) {
					updates[u.id] = randomTask.id;
				}
			});

			setActiveUsers(updates);
		}, 2000);

		return () => clearInterval(interval);
	}, [tasks, setActiveUsers]);
}
