import type { Task } from "../types/task";

export default function TaskCard({ task }: { task: Task }) {
	return (
		<div
			draggable={true}
			onDragStart={(e) => {
				console.log("DRAG START", task.id);
				e.dataTransfer.effectAllowed = "move";
				e.dataTransfer.setData("text/plain", task.id);
			}}
			className='bg-white p-3 mb-2 rounded shadow cursor-grab active:opacity-50'
		>
			<div className='font-medium'>{task.title}</div>

			<div className='flex justify-between text-xs mt-2'>
				<span>{task.assignee}</span>
				<span className='text-red-500'>{task.dueDate}</span>
			</div>

			<div className='text-xs mt-1 capitalize'>{task.priority}</div>
		</div>
	);
}
