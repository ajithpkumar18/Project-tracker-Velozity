import { useCallback } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type { Status } from "../types/task";
import TaskC from "../components/TaskCard";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

const columns: { key: Status; title: string }[] = [
	{ key: "todo", title: "To Do" },
	{ key: "in-progress", title: "In Progress" },
	{ key: "in-review", title: "In Review" },
	{ key: "done", title: "Done" },
];

const columnHeader: Record<
	Status,
	{ dot: string; text: string; bg: string; border: string }
> = {
	todo: {
		dot: "bg-slate-400",
		text: "text-slate-600",
		bg: "bg-slate-50",
		border: "border-slate-200",
	},
	"in-progress": {
		dot: "bg-blue-400",
		text: "text-blue-600",
		bg: "bg-blue-50",
		border: "border-blue-200",
	},
	"in-review": {
		dot: "bg-purple-400",
		text: "text-purple-600",
		bg: "bg-purple-50",
		border: "border-purple-200",
	},
	done: {
		dot: "bg-emerald-400",
		text: "text-emerald-600",
		bg: "bg-emerald-50",
		border: "border-emerald-200",
	},
};

export default function KanbanV() {
	const tasks = useTaskStore((s) => s.tasks);
	const filters = useTaskStore((s) => s.filters);
	const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);

	const filteredTasks = tasks.filter((t) => {
		const statusMatch =
			filters.status.length === 0 || filters.status.includes(t.status);
		const priorityMatch =
			filters.priority.length === 0 ||
			filters.priority.includes(t.priority);
		return statusMatch && priorityMatch;
	});

	const handleDrop = useCallback(
		(taskId: string, newStatus: Status) => {
			updateTaskStatus(taskId, newStatus);
		},
		[updateTaskStatus],
	);

	const { dragState, registerColumn, onCardPointerDown } = useDragAndDrop({
		onDrop: handleDrop,
	});

	return (
		<div className='grid xs:grid-cols-1 sm:grid-cols-4 gap-4 h-full min-h-0 no-scrollbar overflow-y-auto  md:overflow-hidden'>
			{columns.map((col) => {
				const colTasks = filteredTasks.filter(
					(t) => t.status === col.key,
				);
				const isOver =
					dragState.overColumn === col.key &&
					dragState.draggingId !== null;
				const style = columnHeader[col.key];

				return (
					<div
						key={col.key}
						ref={(el) => registerColumn(col.key, el)}
						className={`
  flex flex-col h-full min-h-48 rounded-xl border-2 transition-colors duration-150
  ${isOver ? `${style.bg} ${style.border}` : "bg-gray-50 border-transparent"}
`}
					>
						{/* Column header */}
						<div className='flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 flex-shrink-0'>
							<span
								className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
							/>
							<h2
								className={`text-sm font-semibold ${style.text}`}
							>
								{col.title}
							</h2>
							<span className='ml-auto text-xs font-mono text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded'>
								{colTasks.length}
							</span>
						</div>

						{/* Cards area */}
						<div className='flex-1 overflow-y-auto p-2 min-h-0'>
							{colTasks.length === 0 && !isOver && (
								<div className='flex flex-col items-center justify-center h-20 text-gray-300'>
									<div className='w-8 h-8 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center mb-1 text-lg'>
										+
									</div>
									<span className='text-xs'>No tasks</span>
								</div>
							)}

							{colTasks.map((task, index) => {
								const isDragging =
									dragState.draggingId === task.id;

								return (
									<div key={task.id}>
										{/* gap indicator */}
										{dragState.overColumn === col.key &&
											dragState.hoverIndex === index && (
												<div className='h-2 mb-2 rounded bg-blue-400/60' />
											)}

										{/* placeholder at original position */}
										{isDragging ? (
											<div className='h-[88px] mb-2 rounded-lg border border-dashed border-gray-200 bg-blue-200' />
										) : (
											<TaskC
												task={task}
												isDragging={false}
												onPointerDown={(e: any) =>
													onCardPointerDown(
														e,
														task.id,
														task.status,
													)
												}
											/>
										)}
									</div>
								);
							})}

							{/* // simple line indicator */}
							{dragState.overColumn === col.key &&
								dragState.hoverIndex === colTasks.length && (
									<div className='h-2 mb-2 rounded bg-blue-400/60' />
								)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
