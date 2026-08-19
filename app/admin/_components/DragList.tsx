"use client";
import { ReactNode } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function DragList<T extends { _key: string }>({
  items, onChange, renderItem,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  renderItem: (item: T, i: number) => ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i._key === active.id);
    const newIndex = items.findIndex((i) => i._key === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i._key)} strategy={verticalListSortingStrategy}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item, i) => (
            <SortableItem key={item._key} id={item._key}>
              {renderItem(item, i)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };
  return (
    <li ref={setNodeRef} style={style}>
      <span className="drag-handle" {...attributes} {...listeners} title="Drag to reorder" style={{ userSelect: "none" }}>⋮⋮</span>
      <div style={{ flex: 1 }}>{children}</div>
    </li>
  );
}
