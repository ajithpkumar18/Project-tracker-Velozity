# Project Tracker UI

A frontend-only project management tool built with React + TypeScript.\
Implements Kanban, List, and Timeline views on a shared dataset with
custom drag-and-drop, virtual scrolling, and simulated collaboration.

## 🚀 Live Demo

[https://project-tracker-velozity.vercel.app/]

## 🛠️ Tech Stack

- React (with TypeScript)
- Zustand (state management)
- Tailwind CSS (styling)

## 📦 Features

### Multi-View (Single Source of Truth)

- Kanban Board (4 columns)
- List View (sortable table)
- Timeline / Gantt View\
  All views share the same state with instant switching.

## 🧲 Drag and Drop Implementation

Drag-and-drop was implemented from scratch using pointer events without any external libraries.

### Approach:

- Used `pointerdown`, `pointermove`, and `pointerup` to manage the drag lifecycle
- Created a floating **ghost element** by cloning the dragged card
- Stored the cursor offset inside the card to keep the drag feel natural
- Registered each column DOM node manually and used `getBoundingClientRect()` for hit-testing

### Column Detection:

- On every pointer move, checked which column the cursor is currently over
- Compared cursor position with column bounding boxes to determine active drop zone

### Positioning Inside Column:

- Calculated insertion index using cursor Y position
- Compared cursor position with the midpoint of each task card
- Based on this, determined where the card should be placed
- Rendered a **small gap indicator line** at the calculated index

### Placeholder Handling:

- When dragging starts, the original card is replaced with a placeholder of the same height
- This prevents layout shift and keeps the column stable while dragging

### Edge Cases:

- Added a small movement threshold (~4px) to avoid accidental drags
- If dropped outside any column, the card snaps back to its original position using a transition
- Cleaned up ghost element on drag end or component unmount

### Note:

Initially tried simpler position calculations, but they broke when the column was scrolled.  
Switching to `getBoundingClientRect()` made the positioning consistent.

### Virtual Scrolling (List View)

Approach:

- Only render rows visible in viewport + buffer rows
- Calculated:
    - startIndex (first visible row)
    - endIndex (last visible row)
    - Used a container to maintain full scroll height
    - Positioned visible rows using offset/transform

### Filters + URL Sync

- Filters: status, priority
- Applied instantly without submit button
- Synced with URL query params using URLSearchParams
- Back/forward navigation restores filter state

### Collaboration Indicators

- Simulated users using interval-based updates
- Each user is randomly assigned to a task
- Avatar indicators displayed on cards
- Active user count shown at top

### Edge Cases

- Empty states
- Due today / overdue handling
- Missing start dates supported

## 🧠 State Management

Used Zustand for simplicity and shared state across views.

## ⚙️ Setup

```bash
git clone https://github.com/ajithpkumar18/Project-tracker-Velozity
cd Project-tracker-Velozity
npm install
npm run dev
```

## 🧪 Data

Includes generator for 500+ randomized tasks.

## 🔍 Lighthouse results

[Lighthouse test result](/images/lighthousetest1.png)

## 🧩 Hardest Problem

Drag-and-drop positioning without libraries, especially calculating
correct insertion index and handling scroll.

## 📌 Notes

- No drag-drop libraries used
- No UI component libraries
- Fully custom implementation
