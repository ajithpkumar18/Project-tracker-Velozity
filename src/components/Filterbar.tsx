import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";

const statuses = ["todo", "in-progress", "in-review", "done"];
const priorities = ["critical", "high", "medium", "low"];

export default function FilterBar() {
	const { filters, setFilters } = useTaskStore();

	const toggle = (type: "status" | "priority", value: string) => {
		const current = filters[type];
		const updated = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];

		setFilters({ [type]: updated });
	};

	useEffect(() => {
		if (!filters) return;

		const params = new URLSearchParams();

		if (filters.status.length)
			params.set("status", filters.status.join(","));

		if (filters.priority.length)
			params.set("priority", filters.priority.join(","));

		window.history.replaceState(null, "", `?${params.toString()}`);
	}, [filters]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);

		const status = params.get("status")
			? params.get("status")!.split(",")
			: [];

		const priority = params.get("priority")
			? params.get("priority")!.split(",")
			: [];

		setFilters({ status, priority });
	}, []);

	return (
		<div className='flex flex-col md:flex-row gap-4 mb-4'>
			<div className='flex-1'>
				<div className='text-sm font-semibold text-green-500 mb-2'>
					Status
				</div>

				<div className='flex flex-wrap gap-2'>
					{statuses.map((s) => (
						<button
							type='button'
							key={s}
							onClick={() => toggle("status", s)}
							className={`px-3 py-1 rounded-md border text-sm transition
              ${
					filters.status.includes(s)
						? "bg-blue-200 border-blue-300"
						: "bg-white border-gray-200"
				}
            `}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			<div className='flex-1'>
				<div className='text-sm font-semibold text-green-500 mb-2'>
					Priority
				</div>

				<div className='flex flex-wrap gap-2'>
					{priorities.map((p) => (
						<button
							type='button'
							key={p}
							onClick={() => toggle("priority", p)}
							className={`px-3 py-1 rounded-md border text-sm transition
              ${
					filters.priority.includes(p)
						? "bg-green-200 border-green-300"
						: "bg-white border-gray-200"
				}
            `}
						>
							{p}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
