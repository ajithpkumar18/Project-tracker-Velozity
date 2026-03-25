import { useTaskStore } from "../store/useTaskStore";
import type { Status } from "../types/task";
import TaskCard from "../components/TaskCard";

const columns = [
	{ key: "todo", title: "To Do" },
	{ key: "in-progress", title: "In Progress" },
	{ key: "in-review", title: "In Review" },
	{ key: "done", title: "Done" },
] as const;

export default function KanbanView() {
	const tasks = useTaskStore((s) => s.tasks);
	const filters = useTaskStore((s) => s.filters);
	const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

	const handleDrop = (e: React.DragEvent, status: Status) => {
		e.preventDefault();
		const id = e.dataTransfer.getData("text/plain");
		console.log("DROP ID:", id);

		if (id) {
			updateTaskStatus(id, status);
		}
	};

	const filteredTasks = tasks.filter((t) => {
		const statusMatch =
			filters.status.length === 0 || filters.status.includes(t.status);

		const priorityMatch =
			filters.priority.length === 0 ||
			filters.priority.includes(t.priority);

		return statusMatch && priorityMatch;
	});

	return (
		<div className='grid grid-cols-4 gap-4'>
			{columns.map((col) => {
				const colTasks = filteredTasks.filter(
					(t) => t.status === col.key,
				);

				return (
					<div
						key={col.key}
						className='p-2 rounded h-[500px] overflow-y-auto bg-gray-100'
						onDragOver={(e) => {
							e.preventDefault();
							console.log("drag over");
						}}
						onDrop={(e) => handleDrop(e, col.key)}
					>
						<h2 className='font-bold mb-2'>
							{col.title} ({colTasks.length})
						</h2>

						{colTasks.map((task) => (
							<div key={task.id}>
								{/* Placeholder */}

								<TaskCard task={task} />
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
}
