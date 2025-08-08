// ────────────────────────────────────────────────
// PaletteItem.tsx
// ────────────────────────────────────────────────
import { useDrag } from "./useDrag";
import { DragData, useDragCtx } from "./DragContext";

interface PaletteItemProps {
  label: string;
  type: string;
}

export default function PaletteItem({ label, type }: PaletteItemProps) {
  const { setDragging } = useDragCtx();

  const { bind, isDragging } = useDrag({
    onStart: () => {
      console.log('PaletteItem onStart called with type:', type);
      setDragging({ type } satisfies DragData);
      console.log('setDragging called with:', { type });
    },
    onEnd: () => {
      console.log('PaletteItem onEnd called');
      setDragging(null);
      console.log('setDragging called with null');
    },
  });

  return (
    <button
      {...bind}
      className={`w-full py-2 rounded border bg-slate-50 hover:bg-slate-100 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {label}
    </button>
  );
}
