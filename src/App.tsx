import { useState } from "react";
import "./index.css";
import KanbanV from "./views/KanbanView";
import ListV from "./views/ListView";
import FilterBar from "./components/Filterbar";
import TimelineView from "./views/GanttView";

function App() {
	const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

	return (
		<div className='h-screen flex flex-col overflow-hidden bg-gray-100'>
			{/* View switcher */}
			<div className='flex-shrink-0 flex items-center gap-2 px-4 py-4 bg-gray-200 border-b border-gray-200'>
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

			{/* Filter bar */}
			<div className='flex-shrink-0 bg-white border-b border-gray-200 p-4 '>
				<FilterBar />
			</div>

			{/* View — fills all remaining height, no outer scroll */}
			<div className='flex-1 min-h-0 p-4'>
				{view === "kanban" && <KanbanV />}
				{view === "list" && <ListV />}
				{view === "timeline" && <TimelineView />}
			</div>
		</div>
	);
}

export default App;
