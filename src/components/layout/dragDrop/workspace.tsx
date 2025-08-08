import { useRef } from "react";
import { useDragCtx } from "@/hooks/dragDrop/DragContext";

export interface Block {
  id: string;
  type: string;
  x: number;
  y: number;
}

export default function Workspace() {
  const { dragging, setDragging } = useDragCtx();
  const surfaceRef = useRef<HTMLDivElement>(null);

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    const rect = surfaceRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 여기서 블록을 생성하거나 처리하는 로직을 추가할 수 있습니다
    console.log(`드롭된 노드: ${dragging.type} at (${x}, ${y})`);
    
    setDragging(null);
  };

  return (
    <div
      ref={surfaceRef}
      className="relative flex-1 bg-white overflow-hidden"
      onPointerUp={handlePointerUp}
    >
      {/* 드롭 영역 - 여기에 노드들이 드롭됩니다 */}
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        노드를 여기에 드롭하세요
      </div>
    </div>
  );
}
