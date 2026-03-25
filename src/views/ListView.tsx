import { useTaskStore } from "../store/useTaskStore";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { Status, Priority } from "../types/task";

const ROW_HEIGHT = 52;
const BUFFER = 5;

const ALL_STATUSES: Status[] = ["todo", "in-progress", "in-review", "done"];

const priorityStyles: Record<Priority, string> = {
	critical: "bg-red-100    text-red-700",
	high: "bg-orange-100 text-orange-700",
	medium: "bg-yellow-100 text-yellow-700",
	low: "bg-green-100  text-green-700",
};

const statusStyles: Record<Status, string> = {
	todo: "text-slate-600",
	"in-progress": "text-blue-600",
	"in-review": "text-purple-600",
	done: "text-emerald-600",
};

const statusLabels: Record<Status, string> = {
	todo: "To Do",
	"in-progress": "In Progress",
	"in-review": "In Review",
	done: "Done",
};

// ─── Update status dropdown ───────────────────────────────────────────────────

function StatusDropdown({ taskId, value }: { taskId: string; value: Status }) {
	const updateTaskStatus = useTaskStore((s) => s.updateTaskStatus);
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node))
				setOpen(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [open]);

	return (
		<div ref={ref} className='relative'>
			<button
				onClick={() => setOpen((o) => !o)}
				className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border border-transparent hover:border-gray-200 hover:bg-white transition-colors ${statusStyles[value]}`}
			>
				<span className={`w-1.5 h-1.5 rounded-full bg-current`} />
				{statusLabels[value]}
				<span className='text-gray-300 ml-0.5'>▾</span>
			</button>

			{open && (
				<div className='absolute z-50 top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[130px]'>
					{ALL_STATUSES.map((s) => (
						<button
							key={s}
							onClick={() => {
								updateTaskStatus(taskId, s);
								setOpen(false);
							}}
							className={`w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 transition-colors ${statusStyles[s]} ${s === value ? "bg-gray-50" : ""}`}
						>
							<span className='w-1.5 h-1.5 rounded-full bg-current' />
							{statusLabels[s]}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

// ─── Main component ──────────────

export default function ListView() {
	const tasks = useTaskStore((s) => s.tasks);
	const filters = useTaskStore((s) => s.filters);
	const [scrollTop, setScrollTop] = useState(0);
	const [containerHeight, setContainerHeight] = useState(500);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver(() =>
			setContainerHeight(el.clientHeight),
		);
		ro.observe(el);
		setContainerHeight(el.clientHeight);
		return () => ro.disconnect();
	}, []);

	const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
		setScrollTop(e.currentTarget.scrollTop);
	}, []);

	// Filter + sort — only recompute when inputs change
	const filtered = useMemo(() => {
		return tasks.filter((t) => {
			if (filters.status.length && !filters.status.includes(t.status))
				return false;

			if (
				filters.priority.length &&
				!filters.priority.includes(t.priority)
			)
				return false;

			return true;
		});
	}, [tasks, filters]);
	// Virtual scrolling calculations
	const totalHeight = filtered.length * ROW_HEIGHT;
	const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
	const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER * 2;
	const endIndex = Math.min(filtered.length, startIndex + visibleCount);
	const visibleTasks = filtered.slice(startIndex, endIndex);
	const offsetY = startIndex * ROW_HEIGHT;

	return (
		<div className='flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 overflow-hidden'>
			<div className='flex-shrink-0 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200'>
				<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
					Title
				</span>
				<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
					Assignee
				</span>
				<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
					Priority
				</span>
				<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
					Status
				</span>
				<span className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
					Due Date
				</span>
			</div>

			{/* If no data */}
			{filtered.length === 0 && (
				<div className='flex-1 flex flex-col items-center justify-center text-gray-400 gap-2'>
					<span className='text-3xl'>🔍</span>
					<p className='text-sm font-medium'>
						No tasks match your filters
					</p>
				</div>
			)}

			{filtered.length > 0 && (
				<div
					ref={containerRef}
					className='flex-1 overflow-y-auto min-h-0'
					onScroll={handleScroll}
				>
					<div style={{ height: totalHeight, position: "relative" }}>
						{/* Only visible rows rendered */}
						<div
							style={{
								position: "absolute",
								top: offsetY,
								left: 0,
								right: 0,
							}}
						>
							{visibleTasks.map((task) => (
								<div
									key={task.id}
									style={{ height: ROW_HEIGHT }}
									className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors'
								>
									<span className='text-sm text-gray-800 font-medium truncate'>
										{task.title}
									</span>

									<span className='text-xs text-gray-500 font-medium bg-gray-100 rounded-full px-2 py-0.5 w-fit'>
										{task.assignee}
									</span>

									<span
										className={`text-[10px] font-semibold px-2 py-0.5 rounded w-fit capitalize ${priorityStyles[task.priority]}`}
									>
										{task.priority}
									</span>

									<StatusDropdown
										taskId={task.id}
										value={task.status}
									/>

									<span className='text-xs text-gray-400'>
										{task.dueDate}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<div className='flex-shrink-0 px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400'>
				{filtered.length.toLocaleString()} of{" "}
				{tasks.length.toLocaleString()} tasks
			</div>
		</div>
	);
}
