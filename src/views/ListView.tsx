import { useTaskStore } from "../store/useTaskStore";
import { useState } from "react";

const ROW_HEIGHT = 60;
const BUFFER = 5;

export default function ListView() {
	const tasks = useTaskStore((s) => s.tasks);
	const [scrollTop, setScrollTop] = useState(0);

	const containerHeight = 500;
	const totalHeight = tasks.length * ROW_HEIGHT;

	const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);

	const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER * 2;

	const endIndex = Math.min(tasks.length, startIndex + visibleCount);

	const visibleTasks = tasks.slice(startIndex, endIndex);

	return (
		<div
			className='h-[500px] overflow-y-auto border'
			onScroll={(e) =>
				setScrollTop((e.target as HTMLDivElement).scrollTop)
			}
		>
			<div style={{ height: totalHeight, position: "relative" }}>
				{visibleTasks.map((task, i) => {
					const index = startIndex + i;

					return (
						<div
							key={task.id}
							className='absolute left-0 right-0 border-b flex items-center px-2'
							style={{
								top: index * ROW_HEIGHT,
								height: ROW_HEIGHT,
							}}
						>
							<div className='w-1/4'>{task.title}</div>
							<div className='w-1/4'>{task.assignee}</div>
							<div className='w-1/4'>{task.priority}</div>
							<div className='w-1/4'>{task.dueDate}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
