import type { Task, Priority } from "../types/task";

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
