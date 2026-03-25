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
		<div className='flex gap-4 mb-4'>
			<div>
				<div className='text-md font-bold text-green-400 py-2'>
					Status
				</div>
				{statuses.map((s) => (
					<button
						type='button'
						key={s}
						onClick={() => toggle("status", s)}
						className={`mr-2 px-2 py-1 border ${
							filters.status.includes(s) ? "bg-blue-200" : ""
						}`}
					>
						{s}
					</button>
				))}
			</div>

			<div>
				<div className='text-md font-bold text-green-400 py-2'>
					Priority
				</div>
				{priorities.map((p) => (
					<button
						type='button'
						key={p}
						onClick={() => toggle("priority", p)}
						className={`mr-2 px-2 py-1 border ${
							filters.priority.includes(p) ? "bg-green-200" : ""
						}`}
					>
						{p}
					</button>
				))}
			</div>
		</div>
	);
}
