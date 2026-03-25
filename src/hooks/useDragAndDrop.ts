import { useRef, useState, useCallback, useEffect } from "react";
import type { Status } from "../types/task";

export interface DragState {
	draggingId: string | null;
	originStatus: Status | null;
	overColumn: Status | null;
	hoverIndex?: number | null;
}

interface ColumnRect {
	status: Status;
	el: HTMLElement;
}

interface UseDragAndDropOptions {
	onDrop: (taskId: string, newStatus: Status) => void;
}

export function useDragAndDrop({ onDrop }: UseDragAndDropOptions) {
	const [dragState, setDragState] = useState<DragState>({
		draggingId: null,
		originStatus: null,
		overColumn: null,
		hoverIndex: null,
	});

	// Skeletal element
	const ghostRef = useRef<HTMLDivElement | null>(null);
	const grabOffsetRef = useRef({ x: 0, y: 0 });
	const columnRectsRef = useRef<ColumnRect[]>([]);
	const didMoveRef = useRef(false);
	const draggingIdRef = useRef<string | null>(null);
	const originStatusRef = useRef<Status | null>(null);

	// Column registration : Each KanbanColumn calls this to register itself
	const registerColumn = useCallback(
		(status: Status, el: HTMLElement | null) => {
			if (!el) {
				columnRectsRef.current = columnRectsRef.current.filter(
					(c) => c.status !== status,
				);
				return;
			}
			const existing = columnRectsRef.current.find(
				(c) => c.status === status,
			);
			if (existing) {
				existing.el = el;
			} else {
				columnRectsRef.current.push({ status, el });
			}
		},
		[],
	);

	const createGhost = useCallback(
		(sourceEl: HTMLElement, x: number, y: number) => {
			if (ghostRef.current) ghostRef.current.remove();

			const rect = sourceEl.getBoundingClientRect();
			const ghost = sourceEl.cloneNode(true) as HTMLDivElement;

			ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      opacity: 0.75;
      box-shadow: 0 16px 40px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15);
      pointer-events: none;
      z-index: 9999;
      border-radius: 8px;
      transform: rotate(1.5deg) scale(1.02);
      transition: transform 0.1s ease;
      cursor: grabbing;
    `;

			document.body.appendChild(ghost);
			ghostRef.current = ghost;

			grabOffsetRef.current = {
				x: x - rect.left,
				y: y - rect.top,
			};
		},
		[],
	);

	const moveGhost = useCallback((x: number, y: number) => {
		if (!ghostRef.current) return;
		ghostRef.current.style.left = `${x - grabOffsetRef.current.x}px`;
		ghostRef.current.style.top = `${y - grabOffsetRef.current.y}px`;
	}, []);

	const removeGhost = useCallback(
		(snapTo?: { x: number; y: number; w: number; h: number }) => {
			const ghost = ghostRef.current;
			if (!ghost) return;

			if (snapTo) {
				ghost.style.transition =
					"left 0.25s ease, top 0.25s ease, transform 0.25s ease, opacity 0.25s ease";
				ghost.style.left = `${snapTo.x}px`;
				ghost.style.top = `${snapTo.y}px`;
				ghost.style.width = `${snapTo.w}px`;
				ghost.style.height = `${snapTo.h}px`;
				ghost.style.transform = "rotate(0deg) scale(1)";
				ghost.style.opacity = "1";
				setTimeout(() => {
					ghost.remove();
				}, 260);
			} else {
				ghost.style.transition = "opacity 0.1s ease";
				ghost.style.opacity = "0";
				setTimeout(() => {
					ghost.remove();
				}, 110);
			}

			ghostRef.current = null;
		},
		[],
	);

	const hitTestColumn = useCallback((x: number, y: number): Status | null => {
		for (const { status, el } of columnRectsRef.current) {
			const rect = el.getBoundingClientRect();
			if (
				x >= rect.left &&
				x <= rect.right &&
				y >= rect.top &&
				y <= rect.bottom
			) {
				return status;
			}
		}
		return null;
	}, []);

	const getHoverIndex = useCallback(
		(columnEl: HTMLElement, clientY: number) => {
			const children = Array.from(columnEl.children) as HTMLElement[];

			for (let i = 0; i < children.length; i++) {
				const rect = children[i].getBoundingClientRect();
				const mid = rect.top + rect.height / 2;

				if (clientY < mid) {
					return i;
				}
			}

			return children.length;
		},
		[],
	);
	const onCardPointerDown = useCallback(
		(
			e: React.PointerEvent<HTMLElement>,
			taskId: string,
			status: Status,
		) => {
			if (e.button !== 0 && e.pointerType === "mouse") return;

			e.currentTarget.setPointerCapture(e.pointerId);
			didMoveRef.current = false;
			draggingIdRef.current = taskId;
			originStatusRef.current = status;

			const sourceEl = e.currentTarget as HTMLElement;

			const originRect = sourceEl.getBoundingClientRect();
			(sourceEl as HTMLElement & { _originRect?: DOMRect })._originRect =
				originRect;

			createGhost(sourceEl, e.clientX, e.clientY);

			const handlePointerMove = (me: PointerEvent) => {
				if (!didMoveRef.current) {
					const dx = me.clientX - e.clientX;
					const dy = me.clientY - e.clientY;
					if (Math.sqrt(dx * dx + dy * dy) < 4) return;
					didMoveRef.current = true;
					setDragState({
						draggingId: taskId,
						originStatus: status,
						overColumn: null,
					});
				}

				moveGhost(me.clientX, me.clientY);

				const over = hitTestColumn(me.clientX, me.clientY);

				let hoverIndex: number | null = null;

				if (over) {
					const col = columnRectsRef.current.find(
						(c) => c.status === over,
					);
					if (col) {
						hoverIndex = getHoverIndex(col.el, me.clientY);
					}
				}

				setDragState((prev) => {
					if (
						prev.overColumn === over &&
						prev.hoverIndex === hoverIndex
					)
						return prev;

					return {
						...prev,
						overColumn: over,
						hoverIndex,
					};
				});
			};

			const handlePointerUp = (ue: PointerEvent) => {
				sourceEl.releasePointerCapture(ue.pointerId);
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp);

				if (!didMoveRef.current) {
					removeGhost();
					setDragState({
						draggingId: null,
						originStatus: null,
						overColumn: null,
						hoverIndex: null,
					});
					return;
				}

				const dropTarget = hitTestColumn(ue.clientX, ue.clientY);

				if (dropTarget && draggingIdRef.current) {
					removeGhost();
					onDrop(draggingIdRef.current, dropTarget);
				} else {
					const orig = (
						sourceEl as HTMLElement & { _originRect?: DOMRect }
					)._originRect;
					if (orig) {
						removeGhost({
							x: orig.left,
							y: orig.top,
							w: orig.width,
							h: orig.height,
						});
					} else {
						removeGhost();
					}
				}

				draggingIdRef.current = null;
				originStatusRef.current = null;
				setDragState({
					draggingId: null,
					originStatus: null,
					overColumn: null,
					hoverIndex: null,
				});
			};

			document.addEventListener("pointermove", handlePointerMove);
			document.addEventListener("pointerup", handlePointerUp);
		},
		[createGhost, moveGhost, removeGhost, hitTestColumn, onDrop],
	);

	useEffect(() => {
		return () => {
			ghostRef.current?.remove();
		};
	}, []);

	return {
		dragState,
		registerColumn,
		onCardPointerDown,
	};
}
