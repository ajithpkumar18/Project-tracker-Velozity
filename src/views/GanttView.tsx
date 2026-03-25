import { useTaskStore } from "../store/useTaskStore";

const DAY_WIDTH = 40;

const colorMap = {
	critical: "bg-red-500",
	high: "bg-orange-400",
	medium: "bg-yellow-400",
	low: "bg-green-400",
};

export default function GanttView() {
	const tasks = useTaskStore((s) => s.tasks);

	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();

	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const getDay = (date: string) => new Date(date).getDate();

	return (
		<div className='flex border h-[90vh]'>
			<div className='w-48 border-r overflow-y-auto'>
				<div className='h-[30px] border-b'></div>

				{tasks.slice(1, 50).map((task) => (
					<div
						key={task.id}
						className='h-[30px] text-sm px-2 border-b'
					>
						{task.title}
					</div>
				))}
			</div>

			{/* RIGHT SIDE */}
			<div className='overflow-x-auto flex-1'>
				<div className='flex h-[30px] border-b'>
					{Array.from({ length: daysInMonth }).map((_, i) => (
						<div
							key={i}
							className='text-xs border-r text-center'
							style={{ width: DAY_WIDTH }}
						>
							{i + 1}
						</div>
					))}
				</div>
				<div
					className='relative'
					style={{ width: daysInMonth * DAY_WIDTH }}
				>
					{/* Today line */}
					<div
						className='absolute top-0 bottom-0 w-[2px] bg-red-500'
						style={{ left: (today.getDate() - 1) * DAY_WIDTH }}
					/>

					{/* Tasks */}
					{tasks.slice(1, 50).map((task, i) => {
						const start = task.startDate
							? getDay(task.startDate)
							: getDay(task.dueDate);

						const end = getDay(task.dueDate);

						const left = (start - 1) * DAY_WIDTH;
						const width = Math.max(
							(end - start + 1) * DAY_WIDTH,
							DAY_WIDTH,
						);

						return (
							<div
								key={task.id}
								className={`absolute text-xs text-white px-1 rounded ${
									colorMap[task.priority]
								}`}
								style={{
									top: i * 30 + 5, // aligned with rows
									left,
									width,
									height: 20,
								}}
							>
								{task.title}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
