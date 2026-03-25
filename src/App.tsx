import { useState } from "react";
import "./index.css";
import KanbanV from "./views/KanbanView";
import ListV from "./views/ListView";
import FilterBar from "./components/Filterbar";
import TimelineView from "./views/GanttView";
import { useCollabSimulation } from "./hooks/useCollabSimulation";
import { useTaskStore } from "./store/useTaskStore";
import { getUserColor } from "./utils/utils";
import { users } from "./utils/utils";

function App() {
	const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");
	useCollabSimulation();

	const activeUsers = useTaskStore((s) => s.activeUsers);
	const userIds = Object.keys(activeUsers);
	return (
		<div className='h-screen flex flex-col overflow-hidden bg-gray-100'>
			{/* View switcher */}
			<div className='flex-shrink-0 flex items-center justify-between px-4 py-4 bg-gray-200 border-b border-gray-200'>
				<div className='flex items-center gap-2'>
					{(["kanban", "list", "timeline"] as const).map((v) => (
						<button
							key={v}
							onClick={() => setView(v)}
							className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
								view === v
									? "bg-blue-600 text-white"
									: "text-gray-600 bg-white hover:bg-gray-100"
							}`}
						>
							{v}
						</button>
					))}
				</div>

				{/* Collaboration indicator */}
				<div className='flex items-center gap-2'>
					<div className='flex -space-x-2'>
						{userIds.map((id) => {
							const user = users.find((u) => u.id === id);

							return (
								<div
									key={id}
									className={`w-6 h-6 text-xs text-white rounded-full flex items-center justify-center border border-white ${getUserColor(id)}`}
								>
									{user?.name || id}
								</div>
							);
						})}
					</div>

					<span className='text-sm text-gray-600'>
						{userIds.length} viewing
					</span>
				</div>
			</div>

			{/* Filter bar */}
			<div className='flex-shrink-0 bg-gray-100 border-b border-gray-200 p-4 '>
				<FilterBar />
			</div>

			{/* Views */}
			<div className='flex-1 min-h-0 p-4'>
				{view === "kanban" && <KanbanV />}
				{view === "list" && <ListV />}
				{view === "timeline" && <TimelineView />}
			</div>
		</div>
	);
}

export default App;
