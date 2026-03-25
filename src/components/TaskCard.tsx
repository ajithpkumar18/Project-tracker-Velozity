import type { Task, Priority } from "../types/task";
import { useTaskStore } from "../store/useTaskStore";
import { users, getUserColor } from "../utils/utils";

const priorityStyles: Record<Priority, string> = {
	critical: "bg-red-100 text-red-700 border border-red-200",
	high: "bg-orange-100 text-orange-700 border border-orange-200",
	medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
	low: "bg-green-100 text-green-700 border border-green-200",
};

function formatDueDate(iso: string): {
	label: string;
	isOverdue: boolean;
	isToday: boolean;
} {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const due = new Date(iso + "T00:00:00");
	const diff = Math.round((due.getTime() - today.getTime()) / 86400000);

	if (diff === 0)
		return { label: "Due Today", isOverdue: false, isToday: true };
	if (diff < 0) {
		const d = Math.abs(diff);
		return {
			label:
				d > 7
					? `${d}d overdue`
					: due.toLocaleDateString("en-GB", {
							day: "numeric",
							month: "short",
						}),
			isOverdue: true,
			isToday: false,
		};
	}
	return {
		label: due.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "short",
		}),
		isOverdue: false,
		isToday: false,
	};
}

interface Props {
	task: Task;
	onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
	isDragging?: boolean;
}

export default function TaskC({
	task,
	onPointerDown,
	isDragging = false,
}: Props) {
	const due = formatDueDate(task.dueDate);

	const activeUsers = useTaskStore((s) => s.activeUsers);

	// mapping the user to show in the card
	const usersHere = Object.entries(activeUsers)
		.filter(([_, taskId]) => String(taskId) === String(task.id))
		.map(([userId]) => userId);

	console.log(activeUsers);
	if (isDragging) {
		return (
			<div
				className='mb-2 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50'
				style={{ height: 88 }}
				aria-hidden='true'
			/>
		);
	}

	return (
		<div
			onPointerDown={onPointerDown}
			style={{ userSelect: "none", touchAction: "none" }}
			className='bg-white border border-gray-200 p-3 mb-2 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-300 transition-all duration-150'
		>
			<div className='font-medium text-sm text-gray-800 leading-snug mb-2'>
				{task.title}
			</div>

			<div className='flex items-center mt-2'>
				<div className='flex -space-x-2'>
					{usersHere.slice(0, 2).map((id) => {
						const user = users.find((u) => u.id === id);
						if (!user) return null;

						return (
							<div
								key={id}
								className={`w-6 h-6 text-xs text-white flex items-center justify-center rounded-full border border-white ${getUserColor(id)}`}
							>
								{user.name}
							</div>
						);
					})}

					{usersHere.length > 2 && (
						<div className='w-6 h-6 text-xs bg-gray-300 rounded-full flex items-center justify-center border border-white'>
							+{usersHere.length - 2}
						</div>
					)}
				</div>
			</div>

			<span
				className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priorityStyles[task.priority]}`}
			>
				{task.priority}
			</span>

			<div className='flex items-center justify-between mt-2'>
				<span className='text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2 py-0.5'>
					{task.assignee}
				</span>
				<span
					className={`text-xs font-medium ${
						due.isToday
							? "text-amber-600"
							: due.isOverdue
								? "text-red-500"
								: "text-gray-400"
					}`}
				>
					{due.label}
				</span>
			</div>
		</div>
	);
}
