import { useState } from "react";
import "./index.css";
import KanbanView from "./views/KanbanView";
import ListView from "./views/ListView";
import FilterBar from "./components/Filterbar";
import TimelineView from "./views/GanttView";

function App() {
	const [view, setView] = useState<"kanban" | "list" | "timeline">("kanban");

	return (
		<div className='p-4 bg-dark'>
			<div className='flex gap-2 mb-4'>
				<button onClick={() => setView("kanban")} className='color-red'>
					Kanban
				</button>
				<button onClick={() => setView("list")}>List</button>
				<button onClick={() => setView("timeline")}>Timeline</button>
			</div>
			<div>
				<FilterBar />
			</div>

			{view === "kanban" && <KanbanView />}
			{view === "list" && <ListView />}
			{view === "timeline" && <TimelineView />}
		</div>
	);
}

export default App;
